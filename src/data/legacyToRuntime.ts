import type { Chapter, Scene } from "./types";
import type { RuntimeChapter, RuntimeNode } from "./runtimeTypes";

/** Convert legacy linear Scene[] chapter into a RuntimeChapter graph. */
export function legacyChapterToRuntime(chapter: Chapter): RuntimeChapter {
  const nodes: RuntimeNode[] = [];

  for (let i = 0; i < chapter.scenes.length; i++) {
    const scene = chapter.scenes[i];
    const id = `legacy_${chapter.id}_${scene.id}`;
    const nextScene = chapter.scenes[i + 1];
    const hasChoices = Boolean(scene.choices?.length);

    const node: RuntimeNode = {
      id,
      name: scene.id,
      image: scene.image,
      mood: scene.mood,
      animation: scene.mood === "horror" || scene.mood === "panic" ? "horrorFlicker" : "fade",
      phrases: scene.lines.map((l) => ({
        speaker: l.speaker,
        text: l.text,
        kind: l.kind,
      })),
    };

    if (hasChoices && scene.choices) {
      node.buttons = scene.choices.map((c) => ({
        id: c.id,
        label: c.label,
        next: "__end__",
        resultText: c.result,
      }));
    } else if (nextScene) {
      node.next = `legacy_${chapter.id}_${nextScene.id}`;
    }

    nodes.push(node);
  }

  return {
    id: chapter.id,
    title: chapter.title,
    variables: [],
    nodes,
    entryNodeId: nodes[0]?.id ?? "",
  };
}

export function isRuntimeChapter(
  chapter: Chapter | RuntimeChapter,
): chapter is RuntimeChapter {
  return "nodes" in chapter && "entryNodeId" in chapter;
}

/** Normalize any chapter shape to RuntimeChapter for the player. */
export function toRuntimeChapter(
  chapter: Chapter | RuntimeChapter,
): RuntimeChapter {
  if (isRuntimeChapter(chapter)) return chapter;
  return legacyChapterToRuntime(chapter);
}

export type { Scene };
