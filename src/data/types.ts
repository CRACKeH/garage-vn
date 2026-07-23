export type Mood =
  | "alley"
  | "cozy"
  | "hangover"
  | "unease"
  | "horror"
  | "panic"
  | "haze";

export type Line = {
  speaker: string;
  text: string;
  kind?: "narrator" | "dialog" | "action";
};

export type Choice = {
  id: string;
  label: string;
  result: string;
};

export type Scene = {
  id: string;
  image: string;
  /** Background ambience bed for this scene. */
  mood?: Mood;
  lines: Line[];
  choices?: Choice[];
};

export type Chapter = {
  id: string;
  title: string;
  scenes: Scene[];
};
