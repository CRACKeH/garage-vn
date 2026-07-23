import { scenes as ch01, CHAPTER_TITLE as t01 } from "../../data/chapter01";
import { scenes as ch02, CHAPTER_02_TITLE as t02 } from "../../data/chapter02";
import { scenes as ch03, CHAPTER_03_TITLE as t03 } from "../../data/chapter03";
import type { Chapter, Scene } from "../../data/types";
import { uid } from "../model/ids";
import {
  SPEAKER_COLORS,
  type Character,
  type EditorChapter,
  type EditorScene,
  type Phrase,
  type Project,
  type ScenarioNode,
} from "../model/types";

function ensureCharacter(
  map: Map<string, Character>,
  speaker: string,
): string {
  for (const c of map.values()) {
    if (c.name === speaker) return c.id;
  }
  const id = uid("char");
  map.set(id, {
    id,
    name: speaker,
    color: SPEAKER_COLORS[speaker] ?? "#b0b0b0",
  });
  return id;
}

function sceneToEditorScene(
  scene: Scene,
  charMap: Map<string, Character>,
  xOffset: number,
): EditorScene {
  const phrases: Phrase[] = scene.lines.map((line) => ({
    id: uid("ph"),
    speakerId: ensureCharacter(charMap, line.speaker),
    text: line.text,
    kind: line.kind ?? "dialog",
  }));

  const nodeId = uid("node");
  const node: ScenarioNode = {
    id: nodeId,
    name: `Кадр ${scene.id}`,
    position: { x: 80 + xOffset, y: 120 },
    image: scene.image,
    mood: scene.mood,
    animation: scene.mood === "horror" || scene.mood === "panic" ? "horrorFlicker" : "fade",
    phrases,
    buttons: (scene.choices ?? []).map((choice) => ({
      id: uid("btn"),
      label: choice.label,
      actions: [{ type: "endChapter", resultText: choice.result }],
    })),
  };

  return {
    id: uid("scene"),
    name: `Сцена ${scene.id}`,
    defaultImage: scene.image,
    defaultMood: scene.mood,
    entryNodeId: nodeId,
    nodes: [node],
  };
}

/** Chain scenes within a chapter: last node of scene N → gotoScene N+1 when no choices. */
function linkSceneChain(chapter: EditorChapter): void {
  for (let i = 0; i < chapter.scenes.length - 1; i++) {
    const scene = chapter.scenes[i];
    const next = chapter.scenes[i + 1];
    const entry = scene.nodes.find((n) => n.id === scene.entryNodeId) ?? scene.nodes[0];
    if (!entry) continue;
    if (entry.buttons.length > 0) continue;
    entry.buttons = [
      {
        id: uid("btn"),
        label: "Далее →",
        actions: [{ type: "gotoScene", sceneId: next.id }],
      },
    ];
  }
}

function chapterFromLegacy(
  chapter: Chapter,
  charMap: Map<string, Character>,
): EditorChapter {
  const scenes = chapter.scenes.map((s, i) =>
    sceneToEditorScene(s, charMap, i * 40),
  );
  const editorChapter: EditorChapter = {
    id: chapter.id,
    title: chapter.title,
    scenes,
  };
  linkSceneChain(editorChapter);
  return editorChapter;
}

export function createProjectFromLegacy(): Project {
  const charMap = new Map<string, Character>();
  const legacy: Chapter[] = [
    { id: "01", title: t01, scenes: ch01 },
    { id: "02", title: t02, scenes: ch02 },
    { id: "03", title: t03, scenes: ch03 },
  ];

  const chapters = legacy.map((c) => chapterFromLegacy(c, charMap));

  return {
    version: 1,
    name: "Гараж",
    characters: [...charMap.values()],
    variables: [
      {
        id: "met_monster",
        name: "met_monster",
        type: "bool",
        default: false,
      },
      {
        id: "ending_path",
        name: "ending_path",
        type: "select",
        options: ["none", "run", "grab", "talk"],
        default: "none",
      },
    ],
    chapters,
    groups: [],
  };
}

export function emptyProject(): Project {
  const sceneId = uid("scene");
  const nodeId = uid("node");
  const narratorId = uid("char");
  return {
    version: 1,
    name: "Новый проект",
    characters: [
      { id: narratorId, name: "Нарратор", color: SPEAKER_COLORS["Нарратор"] },
    ],
    variables: [],
    chapters: [
      {
        id: uid("ch"),
        title: "Глава 1",
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
                phrases: [
                  {
                    id: uid("ph"),
                    speakerId: narratorId,
                    text: "Новая сцена…",
                    kind: "narrator",
                  },
                ],
                buttons: [],
              },
            ],
          },
        ],
      },
    ],
    groups: [],
  };
}
