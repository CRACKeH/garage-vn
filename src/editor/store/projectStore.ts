import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createProjectFromLegacy, emptyProject } from "../import/fromLegacy";
import { uid } from "../model/ids";
import type {
  Button,
  EditorScene,
  Phrase,
  Project,
  ScenarioNode,
  Variable,
} from "../model/types";

type Selection =
  | { kind: "node"; nodeId: string }
  | { kind: "none" };

type ProjectState = {
  project: Project;
  chapterId: string;
  sceneId: string;
  selection: Selection;
  dirty: boolean;
  highlightedVarId: string | null;
  playtestOpen: boolean;

  setProject: (project: Project) => void;
  markClean: () => void;
  selectChapter: (id: string) => void;
  selectScene: (id: string) => void;
  selectNode: (nodeId: string | null) => void;
  setHighlightedVar: (id: string | null) => void;
  setPlaytestOpen: (open: boolean) => void;

  updateProjectName: (name: string) => void;

  addChapter: () => void;
  renameChapter: (id: string, title: string) => void;
  removeChapter: (id: string) => void;

  addScene: () => void;
  renameScene: (id: string, name: string) => void;
  removeScene: (id: string) => void;
  reorderScenes: (from: number, to: number) => void;

  addNode: (partial?: Partial<ScenarioNode>) => string;
  updateNode: (nodeId: string, patch: Partial<ScenarioNode>) => void;
  removeNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
  setEntryNode: (nodeId: string) => void;

  addPhrase: (nodeId: string) => void;
  updatePhrase: (nodeId: string, phraseId: string, patch: Partial<Phrase>) => void;
  removePhrase: (nodeId: string, phraseId: string) => void;

  addButton: (nodeId: string) => void;
  updateButton: (nodeId: string, buttonId: string, patch: Partial<Button>) => void;
  removeButton: (nodeId: string, buttonId: string) => void;

  addVariable: (type: "bool" | "select") => void;
  updateVariable: (id: string, patch: Partial<Variable>) => void;
  removeVariable: (id: string) => void;

  addCharacter: (name: string) => string;
  connectDefaultNext: (fromId: string, toId: string | undefined) => void;
  connectButtonGoto: (nodeId: string, buttonId: string, targetNodeId: string) => void;

  getActiveChapter: () => Project["chapters"][0] | undefined;
  getActiveScene: () => EditorScene | undefined;
};

function firstIds(project: Project) {
  const chapter = project.chapters[0];
  const scene = chapter?.scenes[0];
  const entry =
    scene?.entryNodeId ?? scene?.nodes[0]?.id ?? null;
  return {
    chapterId: chapter?.id ?? "",
    sceneId: scene?.id ?? "",
    entryNodeId: entry,
  };
}

function selectEntryOfScene(
  s: {
    project: Project;
    chapterId: string;
    sceneId: string;
    selection: Selection;
  },
  sceneId?: string,
) {
  const ch = s.project.chapters.find((c) => c.id === s.chapterId);
  const scene = ch?.scenes.find((sc) => sc.id === (sceneId ?? s.sceneId));
  const entry = scene?.entryNodeId ?? scene?.nodes[0]?.id;
  s.selection = entry ? { kind: "node", nodeId: entry } : { kind: "none" };
}

const seed = createProjectFromLegacy();
const seedIds = firstIds(seed);

export const useProjectStore = create<ProjectState>()(
  immer((set, get) => ({
    project: seed,
    chapterId: seedIds.chapterId,
    sceneId: seedIds.sceneId,
    selection: seedIds.entryNodeId
      ? { kind: "node", nodeId: seedIds.entryNodeId }
      : { kind: "none" },
    dirty: false,
    highlightedVarId: null,
    playtestOpen: false,

    setProject: (project) =>
      set((s) => {
        const ids = firstIds(project);
        s.project = project;
        s.chapterId = ids.chapterId;
        s.sceneId = ids.sceneId;
        s.selection = ids.entryNodeId
          ? { kind: "node", nodeId: ids.entryNodeId }
          : { kind: "none" };
        s.dirty = false;
      }),

    markClean: () =>
      set((s) => {
        s.dirty = false;
      }),

    selectChapter: (id) =>
      set((s) => {
        s.chapterId = id;
        const ch = s.project.chapters.find((c) => c.id === id);
        s.sceneId = ch?.scenes[0]?.id ?? "";
        selectEntryOfScene(s);
      }),

    selectScene: (id) =>
      set((s) => {
        s.sceneId = id;
        selectEntryOfScene(s, id);
      }),

    selectNode: (nodeId) =>
      set((s) => {
        s.selection = nodeId ? { kind: "node", nodeId } : { kind: "none" };
      }),

    setHighlightedVar: (id) =>
      set((s) => {
        s.highlightedVarId = id;
      }),

    setPlaytestOpen: (open) =>
      set((s) => {
        s.playtestOpen = open;
      }),

    updateProjectName: (name) =>
      set((s) => {
        s.project.name = name;
        s.dirty = true;
      }),

    addChapter: () =>
      set((s) => {
        const nodeId = uid("node");
        const sceneId = uid("scene");
        const char = s.project.characters[0];
        const ch = {
          id: uid("ch"),
          title: `Глава ${s.project.chapters.length + 1}`,
          scenes: [
            {
              id: sceneId,
              name: "Сцена 1",
              entryNodeId: nodeId,
              nodes: [
                {
                  id: nodeId,
                  name: "Старт",
                  position: { x: 120, y: 140 },
                  phrases: char
                    ? [
                        {
                          id: uid("ph"),
                          speakerId: char.id,
                          text: "",
                          kind: "narrator" as const,
                        },
                      ]
                    : [],
                  buttons: [],
                },
              ],
            },
          ],
        };
        s.project.chapters.push(ch);
        s.chapterId = ch.id;
        s.sceneId = sceneId;
        s.dirty = true;
      }),

    renameChapter: (id, title) =>
      set((s) => {
        const ch = s.project.chapters.find((c) => c.id === id);
        if (ch) ch.title = title;
        s.dirty = true;
      }),

    removeChapter: (id) =>
      set((s) => {
        if (s.project.chapters.length <= 1) return;
        s.project.chapters = s.project.chapters.filter((c) => c.id !== id);
        if (s.chapterId === id) {
          const ids = firstIds(s.project);
          s.chapterId = ids.chapterId;
          s.sceneId = ids.sceneId;
        }
        s.dirty = true;
      }),

    addScene: () =>
      set((s) => {
        const ch = s.project.chapters.find((c) => c.id === s.chapterId);
        if (!ch) return;
        const nodeId = uid("node");
        const sceneId = uid("scene");
        const char = s.project.characters[0];
        ch.scenes.push({
          id: sceneId,
          name: `Сцена ${ch.scenes.length + 1}`,
          entryNodeId: nodeId,
          nodes: [
            {
              id: nodeId,
              name: "Старт",
              position: { x: 120, y: 140 },
              phrases: char
                ? [
                    {
                      id: uid("ph"),
                      speakerId: char.id,
                      text: "",
                      kind: "narrator",
                    },
                  ]
                : [],
              buttons: [],
            },
          ],
        });
        s.sceneId = sceneId;
        s.dirty = true;
      }),

    renameScene: (id, name) =>
      set((s) => {
        const ch = s.project.chapters.find((c) => c.id === s.chapterId);
        const scene = ch?.scenes.find((sc) => sc.id === id);
        if (scene) scene.name = name;
        s.dirty = true;
      }),

    removeScene: (id) =>
      set((s) => {
        const ch = s.project.chapters.find((c) => c.id === s.chapterId);
        if (!ch || ch.scenes.length <= 1) return;
        ch.scenes = ch.scenes.filter((sc) => sc.id !== id);
        if (s.sceneId === id) s.sceneId = ch.scenes[0]?.id ?? "";
        s.dirty = true;
      }),

    reorderScenes: (from, to) =>
      set((s) => {
        const ch = s.project.chapters.find((c) => c.id === s.chapterId);
        if (!ch) return;
        const [item] = ch.scenes.splice(from, 1);
        if (!item) return;
        ch.scenes.splice(to, 0, item);
        s.dirty = true;
      }),

    addNode: (partial) => {
      const id = uid("node");
      set((s) => {
        const scene = getScene(s);
        if (!scene) return;
        const char = s.project.characters[0];
        scene.nodes.push({
          id,
          name: partial?.name ?? `Нода ${scene.nodes.length + 1}`,
          position: partial?.position ?? {
            x: 180 + scene.nodes.length * 36,
            y: 160 + (scene.nodes.length % 3) * 40,
          },
          image: partial?.image,
          mood: partial?.mood,
          animation: partial?.animation ?? "fade",
          phrases: partial?.phrases ?? [
            {
              id: uid("ph"),
              speakerId: char?.id ?? "",
              text: "",
              kind: "dialog",
            },
          ],
          buttons: partial?.buttons ?? [],
          defaultNext: partial?.defaultNext,
          sfx: partial?.sfx,
        });
        s.selection = { kind: "node", nodeId: id };
        s.dirty = true;
      });
      return id;
    },

    updateNode: (nodeId, patch) =>
      set((s) => {
        const node = findNode(s, nodeId);
        if (!node) return;
        Object.assign(node, patch);
        s.dirty = true;
      }),

    removeNode: (nodeId) =>
      set((s) => {
        const scene = getScene(s);
        if (!scene || scene.nodes.length <= 1) return;
        scene.nodes = scene.nodes.filter((n) => n.id !== nodeId);
        for (const n of scene.nodes) {
          if (n.defaultNext === nodeId) n.defaultNext = undefined;
          for (const b of n.buttons) {
            b.actions = b.actions.map((a) =>
              a.type === "goto" && a.targetNodeId === nodeId
                ? { ...a, targetNodeId: "" }
                : a,
            );
          }
        }
        if (scene.entryNodeId === nodeId) {
          scene.entryNodeId = scene.nodes[0]?.id;
        }
        if (s.selection.kind === "node" && s.selection.nodeId === nodeId) {
          s.selection = { kind: "none" };
        }
        s.dirty = true;
      }),

    moveNode: (nodeId, x, y) =>
      set((s) => {
        const node = findNode(s, nodeId);
        if (!node) return;
        node.position = { x, y };
        s.dirty = true;
      }),

    setEntryNode: (nodeId) =>
      set((s) => {
        const scene = getScene(s);
        if (!scene) return;
        scene.entryNodeId = nodeId;
        s.dirty = true;
      }),

    addPhrase: (nodeId) =>
      set((s) => {
        const node = findNode(s, nodeId);
        if (!node) return;
        const char = s.project.characters[0];
        node.phrases.push({
          id: uid("ph"),
          speakerId: char?.id ?? "",
          text: "",
          kind: "dialog",
        });
        s.dirty = true;
      }),

    updatePhrase: (nodeId, phraseId, patch) =>
      set((s) => {
        const node = findNode(s, nodeId);
        const phrase = node?.phrases.find((p) => p.id === phraseId);
        if (!phrase) return;
        Object.assign(phrase, patch);
        s.dirty = true;
      }),

    removePhrase: (nodeId, phraseId) =>
      set((s) => {
        const node = findNode(s, nodeId);
        if (!node) return;
        node.phrases = node.phrases.filter((p) => p.id !== phraseId);
        s.dirty = true;
      }),

    addButton: (nodeId) =>
      set((s) => {
        const node = findNode(s, nodeId);
        if (!node) return;
        node.buttons.push({
          id: uid("btn"),
          label: "Выбор",
          actions: [],
        });
        s.dirty = true;
      }),

    updateButton: (nodeId, buttonId, patch) =>
      set((s) => {
        const node = findNode(s, nodeId);
        const button = node?.buttons.find((b) => b.id === buttonId);
        if (!button) return;
        Object.assign(button, patch);
        s.dirty = true;
      }),

    removeButton: (nodeId, buttonId) =>
      set((s) => {
        const node = findNode(s, nodeId);
        if (!node) return;
        node.buttons = node.buttons.filter((b) => b.id !== buttonId);
        s.dirty = true;
      }),

    addVariable: (type) =>
      set((s) => {
        if (type === "bool") {
          s.project.variables.push({
            id: uid("var"),
            name: `flag_${s.project.variables.length + 1}`,
            type: "bool",
            default: false,
          });
        } else {
          s.project.variables.push({
            id: uid("var"),
            name: `choice_${s.project.variables.length + 1}`,
            type: "select",
            options: ["a", "b"],
            default: "a",
          });
        }
        s.dirty = true;
      }),

    updateVariable: (id, patch) =>
      set((s) => {
        const idx = s.project.variables.findIndex((v) => v.id === id);
        if (idx < 0) return;
        const current = s.project.variables[idx];
        s.project.variables[idx] = { ...current, ...patch } as Variable;
        s.dirty = true;
      }),

    removeVariable: (id) =>
      set((s) => {
        s.project.variables = s.project.variables.filter((v) => v.id !== id);
        s.dirty = true;
      }),

    addCharacter: (name) => {
      const id = uid("char");
      set((s) => {
        s.project.characters.push({
          id,
          name,
          color: "#b0b0b0",
        });
        s.dirty = true;
      });
      return id;
    },

    connectDefaultNext: (fromId, toId) =>
      set((s) => {
        const node = findNode(s, fromId);
        if (!node) return;
        node.defaultNext = toId;
        s.dirty = true;
      }),

    connectButtonGoto: (nodeId, buttonId, targetNodeId) =>
      set((s) => {
        const node = findNode(s, nodeId);
        const button = node?.buttons.find((b) => b.id === buttonId);
        if (!button) return;
        const withoutGoto = button.actions.filter((a) => a.type !== "goto");
        button.actions = [
          ...withoutGoto,
          { type: "goto", targetNodeId },
        ];
        s.dirty = true;
      }),

    getActiveChapter: () => {
      const s = get();
      return s.project.chapters.find((c) => c.id === s.chapterId);
    },

    getActiveScene: () => {
      const s = get();
      const ch = s.project.chapters.find((c) => c.id === s.chapterId);
      return ch?.scenes.find((sc) => sc.id === s.sceneId);
    },
  })),
);

type Draft = {
  project: Project;
  chapterId: string;
  sceneId: string;
  selection: Selection;
  dirty: boolean;
};

function getScene(s: Draft): EditorScene | undefined {
  const ch = s.project.chapters.find((c) => c.id === s.chapterId);
  return ch?.scenes.find((sc) => sc.id === s.sceneId);
}

function findNode(s: Draft, nodeId: string): ScenarioNode | undefined {
  return getScene(s)?.nodes.find((n) => n.id === nodeId);
}

export function resetToLegacy(): void {
  useProjectStore.getState().setProject(createProjectFromLegacy());
}

export function resetToEmpty(): void {
  useProjectStore.getState().setProject(emptyProject());
}
