export type Mood =
  | "alley"
  | "cozy"
  | "hangover"
  | "unease"
  | "horror"
  | "panic"
  | "haze";

export type AnimationType =
  | "none"
  | "fade"
  | "pulse"
  | "glitch"
  | "shake"
  | "horrorFlicker";

export type Condition = {
  varId: string;
  op: "eq" | "neq";
  value: boolean | string;
};

export type Phrase = {
  id: string;
  speakerId: string;
  text: string;
  kind: "narrator" | "dialog" | "action";
  visibleIf?: Condition[];
};

export type ButtonAction =
  | { type: "goto"; targetNodeId: string }
  | { type: "gotoGroup"; groupId: string; entryNodeId?: string }
  | { type: "setVar"; varId: string; value: boolean | string }
  | { type: "gotoScene"; sceneId: string }
  | { type: "gotoChapter"; chapterId: string }
  | { type: "endChapter"; resultText?: string };

export type Button = {
  id: string;
  label: string;
  actions: ButtonAction[];
  visibleIf?: Condition[];
};

export type ScenarioNode = {
  id: string;
  name: string;
  position: { x: number; y: number };
  image?: string;
  animation?: AnimationType;
  mood?: Mood;
  sfx?: string[];
  phrases: Phrase[];
  buttons: Button[];
  defaultNext?: string;
};

export type Variable =
  | { id: string; name: string; type: "bool"; default: boolean }
  | { id: string; name: string; type: "select"; options: string[]; default: string };

export type Character = {
  id: string;
  name: string;
  color: string;
};

export type EditorScene = {
  id: string;
  name: string;
  defaultImage?: string;
  defaultMood?: Mood;
  entryNodeId?: string;
  nodes: ScenarioNode[];
};

export type EditorChapter = {
  id: string;
  title: string;
  scenes: EditorScene[];
};

export type NodeGroup = {
  id: string;
  name: string;
  entryNodeId?: string;
  nodes: ScenarioNode[];
};

export type Project = {
  version: 1;
  name: string;
  characters: Character[];
  variables: Variable[];
  chapters: EditorChapter[];
  groups: NodeGroup[];
};

export const MOODS: Mood[] = [
  "alley",
  "cozy",
  "hangover",
  "unease",
  "horror",
  "panic",
  "haze",
];

export const ANIMATIONS: AnimationType[] = [
  "none",
  "fade",
  "pulse",
  "glitch",
  "shake",
  "horrorFlicker",
];

export const SPEAKER_COLORS: Record<string, string> = {
  Нарратор: "#8a8a8a",
  Женек: "#f57c1f",
  Вадим: "#4ecdc4",
  Олег: "#7eb8da",
  "Олег-Монстр": "#c44d4d",
  Тёмка: "#9b7ed9",
};
