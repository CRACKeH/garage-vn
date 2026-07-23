import type { Mood } from "./types";

export type RuntimeCondition = {
  varId: string;
  op: "eq" | "neq";
  value: boolean | string;
};

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
  /** node id | __end__ | __scene__:id | __chapter__:id */
  next: string;
  resultText?: string;
};

export type RuntimeNode = {
  id: string;
  name?: string;
  image?: string;
  mood?: Mood | string;
  animation?: string;
  sfx?: string[];
  phrases: RuntimePhrase[];
  buttons?: RuntimeButton[];
  next?: string;
};

export type RuntimeVariable =
  | { id: string; name: string; type: "bool"; default: boolean }
  | { id: string; name: string; type: "select"; options: string[]; default: string };

export type RuntimeChapter = {
  id: string;
  title: string;
  variables: RuntimeVariable[];
  nodes: RuntimeNode[];
  entryNodeId: string;
};

export type VarState = Record<string, boolean | string>;

export function initVars(variables: RuntimeVariable[]): VarState {
  const state: VarState = {};
  for (const v of variables) {
    state[v.id] = v.default;
  }
  return state;
}

export function evalConditions(
  conditions: RuntimeCondition[] | undefined,
  vars: VarState,
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((c) => {
    const cur = vars[c.varId];
    if (c.op === "eq") return cur === c.value;
    return cur !== c.value;
  });
}

export function visiblePhrases(node: RuntimeNode, vars: VarState): RuntimePhrase[] {
  return node.phrases.filter((p) => evalConditions(p.visibleIf, vars));
}

export function visibleButtons(node: RuntimeNode, vars: VarState): RuntimeButton[] {
  return (node.buttons ?? []).filter((b) => evalConditions(b.visibleIf, vars));
}
