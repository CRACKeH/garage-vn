import { useProjectStore } from "../store/projectStore";
import type { ButtonAction, Condition } from "../model/types";
import { ANIMATIONS, MOODS } from "../model/types";
import { pickImagePublicPath } from "../pickImage";

function ConditionEditor({
  conditions,
  onChange,
}: {
  conditions?: Condition[];
  onChange: (c: Condition[] | undefined) => void;
}) {
  const variables = useProjectStore((s) => s.project.variables);
  const list = conditions ?? [];

  return (
    <div>
      {list.map((c, i) => {
        const v = variables.find((x) => x.id === c.varId);
        return (
          <div key={i} className="field-row" style={{ marginBottom: 4 }}>
            <select
              value={c.varId}
              onChange={(e) => {
                const next = [...list];
                const nv = variables.find((x) => x.id === e.target.value);
                next[i] = {
                  ...c,
                  varId: e.target.value,
                  value: nv?.type === "bool" ? false : (nv?.options[0] ?? ""),
                };
                onChange(next);
              }}
            >
              {variables.map((vr) => (
                <option key={vr.id} value={vr.id}>
                  {vr.name}
                </option>
              ))}
            </select>
            <select
              value={c.op}
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...c, op: e.target.value as "eq" | "neq" };
                onChange(next);
              }}
            >
              <option value="eq">=</option>
              <option value="neq">≠</option>
            </select>
            {v?.type === "bool" ? (
              <select
                value={String(c.value)}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = { ...c, value: e.target.value === "true" };
                  onChange(next);
                }}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : (
              <select
                value={String(c.value)}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = { ...c, value: e.target.value };
                  onChange(next);
                }}
              >
                {(v?.type === "select" ? v.options : []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              className="mini-btn danger"
              onClick={() => {
                const next = list.filter((_, j) => j !== i);
                onChange(next.length ? next : undefined);
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className="mini-btn"
        disabled={variables.length === 0}
        onClick={() => {
          const first = variables[0];
          if (!first) return;
          onChange([
            ...list,
            {
              varId: first.id,
              op: "eq",
              value: first.type === "bool" ? true : first.options[0] ?? "",
            },
          ]);
        }}
      >
        + Condition
      </button>
    </div>
  );
}

function ActionsEditor({
  actions,
  nodeOptions,
  onChange,
}: {
  actions: ButtonAction[];
  nodeOptions: { id: string; name: string }[];
  onChange: (a: ButtonAction[]) => void;
}) {
  const variables = useProjectStore((s) => s.project.variables);
  const chapter = useProjectStore((s) => s.getActiveChapter());
  const scenes = chapter?.scenes ?? [];

  return (
    <div>
      {actions.map((a, i) => (
        <div key={i} className="card" style={{ padding: 6 }}>
          <div className="field">
            <label>Action</label>
            <select
              value={a.type}
              onChange={(e) => {
                const type = e.target.value as ButtonAction["type"];
                const next = [...actions];
                if (type === "goto") {
                  next[i] = { type, targetNodeId: nodeOptions[0]?.id ?? "" };
                } else if (type === "setVar") {
                  const v = variables[0];
                  next[i] = {
                    type,
                    varId: v?.id ?? "",
                    value: v?.type === "bool" ? true : v?.options[0] ?? "",
                  };
                } else if (type === "gotoScene") {
                  next[i] = { type, sceneId: scenes[0]?.id ?? "" };
                } else if (type === "gotoChapter") {
                  next[i] = { type, chapterId: "" };
                } else if (type === "gotoGroup") {
                  next[i] = { type, groupId: "" };
                } else {
                  next[i] = { type: "endChapter", resultText: "" };
                }
                onChange(next);
              }}
            >
              <option value="goto">goto node</option>
              <option value="setVar">set variable</option>
              <option value="gotoScene">goto scene</option>
              <option value="endChapter">end chapter</option>
            </select>
          </div>
          {a.type === "goto" && (
            <div className="field">
              <select
                value={a.targetNodeId}
                onChange={(e) => {
                  const next = [...actions];
                  next[i] = { type: "goto", targetNodeId: e.target.value };
                  onChange(next);
                }}
              >
                {nodeOptions.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {a.type === "setVar" && (
            <div className="field-row">
              <select
                value={a.varId}
                onChange={(e) => {
                  const v = variables.find((x) => x.id === e.target.value);
                  const next = [...actions];
                  next[i] = {
                    type: "setVar",
                    varId: e.target.value,
                    value: v?.type === "bool" ? true : v?.options[0] ?? "",
                  };
                  onChange(next);
                }}
              >
                {variables.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              {(() => {
                const v = variables.find((x) => x.id === a.varId);
                if (v?.type === "bool") {
                  return (
                    <select
                      value={String(a.value)}
                      onChange={(e) => {
                        const next = [...actions];
                        next[i] = {
                          type: "setVar",
                          varId: a.varId,
                          value: e.target.value === "true",
                        };
                        onChange(next);
                      }}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  );
                }
                return (
                  <select
                    value={String(a.value)}
                    onChange={(e) => {
                      const next = [...actions];
                      next[i] = {
                        type: "setVar",
                        varId: a.varId,
                        value: e.target.value,
                      };
                      onChange(next);
                    }}
                  >
                    {(v?.type === "select" ? v.options : []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
          )}
          {a.type === "gotoScene" && (
            <div className="field">
              <select
                value={a.sceneId}
                onChange={(e) => {
                  const next = [...actions];
                  next[i] = { type: "gotoScene", sceneId: e.target.value };
                  onChange(next);
                }}
              >
                {scenes.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {a.type === "endChapter" && (
            <div className="field">
              <textarea
                value={a.resultText ?? ""}
                placeholder="Ending text"
                onChange={(e) => {
                  const next = [...actions];
                  next[i] = { type: "endChapter", resultText: e.target.value };
                  onChange(next);
                }}
              />
            </div>
          )}
          <button
            type="button"
            className="mini-btn danger"
            onClick={() => onChange(actions.filter((_, j) => j !== i))}
          >
            Remove action
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mini-btn"
        onClick={() =>
          onChange([
            ...actions,
            { type: "goto", targetNodeId: nodeOptions[0]?.id ?? "" },
          ])
        }
      >
        + Action
      </button>
    </div>
  );
}

export function Inspector() {
  const selection = useProjectStore((s) => s.selection);
  const project = useProjectStore((s) => s.project);
  const chapterId = useProjectStore((s) => s.chapterId);
  const scene = useProjectStore((s) => s.getActiveScene());
  const updateNode = useProjectStore((s) => s.updateNode);
  const addPhrase = useProjectStore((s) => s.addPhrase);
  const updatePhrase = useProjectStore((s) => s.updatePhrase);
  const removePhrase = useProjectStore((s) => s.removePhrase);
  const addButton = useProjectStore((s) => s.addButton);
  const updateButton = useProjectStore((s) => s.updateButton);
  const removeButton = useProjectStore((s) => s.removeButton);
  const removeNode = useProjectStore((s) => s.removeNode);
  const setEntryNode = useProjectStore((s) => s.setEntryNode);
  const connectDefaultNext = useProjectStore((s) => s.connectDefaultNext);

  if (selection.kind !== "node" || !scene) {
    return (
      <div className="panel-scroll">
        <div className="empty-state">
          Выберите ноду на канвасе.
          <br />
          Tab — создать новую.
        </div>
      </div>
    );
  }

  const node = scene.nodes.find((n) => n.id === selection.nodeId);
  if (!node) {
    return (
      <div className="panel-scroll">
        <div className="empty-state">Нода не найдена</div>
      </div>
    );
  }

  const nodeOptions = scene.nodes
    .filter((n) => n.id !== node.id)
    .map((n) => ({ id: n.id, name: n.name }));

  return (
    <div className="panel-scroll">
      <div className="field">
        <label>Name</label>
        <input
          value={node.name}
          onChange={(e) => updateNode(node.id, { name: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Image path</label>
        <input
          value={node.image ?? ""}
          placeholder="/chapter01/...."
          onChange={(e) =>
            updateNode(node.id, { image: e.target.value || undefined })
          }
        />
        <button
          type="button"
          className="mini-btn accent image-browse-btn"
          title="Выбрать файл через Finder (файл должен лежать в public/)"
          onClick={() => {
            void pickImagePublicPath(chapterId).then((path) => {
              if (path) updateNode(node.id, { image: path });
            });
          }}
        >
          Выбрать файл…
        </button>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Mood</label>
          <select
            value={node.mood ?? ""}
            onChange={(e) =>
              updateNode(node.id, {
                mood: (e.target.value || undefined) as typeof node.mood,
              })
            }
          >
            <option value="">—</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Animation</label>
          <select
            value={node.animation ?? "none"}
            onChange={(e) =>
              updateNode(node.id, {
                animation: e.target.value as typeof node.animation,
              })
            }
          >
            {ANIMATIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Default next (auto)</label>
        <select
          value={node.defaultNext ?? ""}
          onChange={(e) =>
            connectDefaultNext(node.id, e.target.value || undefined)
          }
        >
          <option value="">— none —</option>
          {nodeOptions.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      <div className="tree-actions" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="mini-btn accent"
          onClick={() => setEntryNode(node.id)}
        >
          Set as entry
        </button>
        <button
          type="button"
          className="mini-btn danger"
          onClick={() => removeNode(node.id)}
        >
          Delete node
        </button>
      </div>

      <div className="panel-header" style={{ margin: "0 -8px 8px" }}>
        Phrases
      </div>
      {node.phrases.map((ph, idx) => (
        <div key={ph.id} className="card">
          <div className="card-head">
            <span>#{idx + 1}</span>
            <button
              type="button"
              className="mini-btn danger"
              onClick={() => removePhrase(node.id, ph.id)}
            >
              ×
            </button>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Speaker</label>
              <select
                value={ph.speakerId}
                onChange={(e) =>
                  updatePhrase(node.id, ph.id, { speakerId: e.target.value })
                }
              >
                {project.characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Kind</label>
              <select
                value={ph.kind}
                onChange={(e) =>
                  updatePhrase(node.id, ph.id, {
                    kind: e.target.value as typeof ph.kind,
                  })
                }
              >
                <option value="dialog">dialog</option>
                <option value="narrator">narrator</option>
                <option value="action">action</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Text</label>
            <textarea
              value={ph.text}
              onChange={(e) =>
                updatePhrase(node.id, ph.id, { text: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Visible if</label>
            <ConditionEditor
              conditions={ph.visibleIf}
              onChange={(visibleIf) =>
                updatePhrase(node.id, ph.id, { visibleIf })
              }
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="mini-btn"
        onClick={() => addPhrase(node.id)}
      >
        + Phrase
      </button>

      <div className="panel-header" style={{ margin: "12px -8px 8px" }}>
        Buttons
      </div>
      {node.buttons.map((btn) => (
        <div key={btn.id} className="card">
          <div className="card-head">
            <span>Button</span>
            <button
              type="button"
              className="mini-btn danger"
              onClick={() => removeButton(node.id, btn.id)}
            >
              ×
            </button>
          </div>
          <div className="field">
            <label>Label</label>
            <input
              value={btn.label}
              onChange={(e) =>
                updateButton(node.id, btn.id, { label: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Visible if</label>
            <ConditionEditor
              conditions={btn.visibleIf}
              onChange={(visibleIf) =>
                updateButton(node.id, btn.id, { visibleIf })
              }
            />
          </div>
          <div className="field">
            <label>Actions</label>
            <ActionsEditor
              actions={btn.actions}
              nodeOptions={nodeOptions}
              onChange={(actions) => updateButton(node.id, btn.id, { actions })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="mini-btn"
        onClick={() => addButton(node.id)}
      >
        + Button
      </button>
    </div>
  );
}
