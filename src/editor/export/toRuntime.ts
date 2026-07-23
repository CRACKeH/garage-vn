import type {
  ButtonAction,
  Condition,
  EditorChapter,
  EditorScene,
  Project,
  ScenarioNode,
  Variable,
} from "../model/types";

/** Compiled runtime types (also used by the game player). */
export type RuntimeCondition = Condition;

export type RuntimePhrase = {
  speaker: string;
  text: string;
  kind?: "narrator" | "dialog" | "action";
  visibleIf?: RuntimeCondition[];
};

export type RuntimeButton = {
  id: string;
  label: string;
  visibleIf?: RuntimeCondition[];
  set?: Record<string, boolean | string>;
  next: string; // node id | __end__ | __scene__:id | __chapter__:id
  resultText?: string;
};

export type RuntimeNode = {
  id: string;
  name?: string;
  image?: string;
  mood?: string;
  animation?: string;
  sfx?: string[];
  phrases: RuntimePhrase[];
  buttons?: RuntimeButton[];
  next?: string;
};

export type RuntimeVariable = Variable;

export type RuntimeChapter = {
  id: string;
  title: string;
  variables: RuntimeVariable[];
  /** Flattened nodes across all scenes (ids prefixed with scene for uniqueness). */
  nodes: RuntimeNode[];
  entryNodeId: string;
};

function speakerName(project: Project, speakerId: string): string {
  return project.characters.find((c) => c.id === speakerId)?.name ?? "???";
}

function compileActions(
  actions: ButtonAction[],
): { set?: Record<string, boolean | string>; next: string; resultText?: string } {
  const set: Record<string, boolean | string> = {};
  let next = "__end__";
  let resultText: string | undefined;

  for (const a of actions) {
    if (a.type === "setVar") {
      set[a.varId] = a.value;
    } else if (a.type === "goto") {
      next = a.targetNodeId;
    } else if (a.type === "gotoScene") {
      next = `__scene__:${a.sceneId}`;
    } else if (a.type === "gotoChapter") {
      next = `__chapter__:${a.chapterId}`;
    } else if (a.type === "gotoGroup") {
      next = a.entryNodeId ? a.entryNodeId : `__group__:${a.groupId}`;
    } else if (a.type === "endChapter") {
      next = "__end__";
      resultText = a.resultText;
    }
  }

  return {
    set: Object.keys(set).length ? set : undefined,
    next,
    resultText,
  };
}

function scopedNodeId(sceneId: string, nodeId: string): string {
  return `${sceneId}__${nodeId}`;
}

function remapNext(
  next: string,
  scene: EditorScene,
  chapter: EditorChapter,
): string {
  if (next.startsWith("__")) {
    if (next.startsWith("__scene__:")) {
      const sceneId = next.slice("__scene__:".length);
      const target = chapter.scenes.find((s) => s.id === sceneId);
      if (target?.entryNodeId) {
        return scopedNodeId(target.id, target.entryNodeId);
      }
    }
    return next;
  }
  // bare node id within same scene
  if (scene.nodes.some((n) => n.id === next)) {
    return scopedNodeId(scene.id, next);
  }
  return next;
}

function compileNode(
  project: Project,
  chapter: EditorChapter,
  scene: EditorScene,
  node: ScenarioNode,
): RuntimeNode {
  const id = scopedNodeId(scene.id, node.id);
  const buttons: RuntimeButton[] | undefined =
    node.buttons.length > 0
      ? node.buttons.map((b) => {
          const compiled = compileActions(b.actions);
          return {
            id: b.id,
            label: b.label,
            visibleIf: b.visibleIf,
            set: compiled.set,
            next: remapNext(compiled.next, scene, chapter),
            resultText: compiled.resultText,
          };
        })
      : undefined;

  let next: string | undefined;
  if (!buttons && node.defaultNext) {
    next = remapNext(node.defaultNext, scene, chapter);
  }

  return {
    id,
    name: node.name,
    image: node.image ?? scene.defaultImage,
    mood: node.mood ?? scene.defaultMood,
    animation: node.animation,
    sfx: node.sfx,
    phrases: node.phrases.map((p) => ({
      speaker: speakerName(project, p.speakerId),
      text: p.text,
      kind: p.kind,
      visibleIf: p.visibleIf,
    })),
    buttons,
    next,
  };
}

export function compileChapter(
  project: Project,
  chapterId: string,
): RuntimeChapter | null {
  const chapter = project.chapters.find((c) => c.id === chapterId);
  if (!chapter || chapter.scenes.length === 0) return null;

  const nodes: RuntimeNode[] = [];
  for (const scene of chapter.scenes) {
    for (const node of scene.nodes) {
      nodes.push(compileNode(project, chapter, scene, node));
    }
  }

  const first = chapter.scenes[0];
  const entryLocal = first.entryNodeId ?? first.nodes[0]?.id;
  if (!entryLocal) return null;

  return {
    id: chapter.id,
    title: chapter.title,
    variables: project.variables,
    nodes,
    entryNodeId: scopedNodeId(first.id, entryLocal),
  };
}

export function compileProject(project: Project): RuntimeChapter[] {
  return project.chapters
    .map((c) => compileChapter(project, c.id))
    .filter((c): c is RuntimeChapter => c !== null);
}

export function chapterToTsSource(chapter: RuntimeChapter): string {
  return `import type { RuntimeChapter } from "./runtimeTypes";

export const CHAPTER_TITLE = ${JSON.stringify(chapter.title)};

export const runtimeChapter: RuntimeChapter = ${JSON.stringify(chapter, null, 2)};
`;
}

export function downloadText(filename: string, text: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportProjectJson(project: Project) {
  downloadText(
    `${project.name.replace(/\s+/g, "_").toLowerCase()}.garage.json`,
    JSON.stringify(project, null, 2),
  );
}

export function exportChapterTs(project: Project, chapterId: string) {
  const compiled = compileChapter(project, chapterId);
  if (!compiled) return;
  downloadText(
    `chapter${chapterId}.ts`,
    chapterToTsSource(compiled),
    "text/typescript",
  );
}

export function exportAllChaptersTs(project: Project) {
  for (const ch of project.chapters) {
    exportChapterTs(project, ch.id);
  }
}
