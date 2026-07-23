import { useProjectStore } from "../store/projectStore";
import type { Variable } from "../model/types";

export function VariablesPanel() {
  const variables = useProjectStore((s) => s.project.variables);
  const highlightedVarId = useProjectStore((s) => s.highlightedVarId);
  const addVariable = useProjectStore((s) => s.addVariable);
  const updateVariable = useProjectStore((s) => s.updateVariable);
  const removeVariable = useProjectStore((s) => s.removeVariable);
  const setHighlightedVar = useProjectStore((s) => s.setHighlightedVar);

  return (
    <div className="panel-scroll">
      <div className="tree-actions" style={{ marginBottom: 8 }}>
        <button
          type="button"
          className="mini-btn"
          onClick={() => addVariable("bool")}
        >
          + Bool
        </button>
        <button
          type="button"
          className="mini-btn"
          onClick={() => addVariable("select")}
        >
          + Select
        </button>
      </div>

      {variables.length === 0 && (
        <div className="empty-state">Нет переменных. Добавьте bool или select.</div>
      )}

      {variables.map((v) => (
        <div
          key={v.id}
          className={`var-row${highlightedVarId === v.id ? " highlighted" : ""}`}
          onClick={() =>
            setHighlightedVar(highlightedVarId === v.id ? null : v.id)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setHighlightedVar(highlightedVarId === v.id ? null : v.id);
            }
          }}
        >
          <div>
            <div className="var-type">{v.type}</div>
            <input
              value={v.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateVariable(v.id, { name: e.target.value })}
              style={{
                width: "100%",
                marginTop: 4,
                background: "#111",
                border: "1px solid var(--studio-border-strong)",
                borderRadius: 4,
                padding: "4px 6px",
              }}
            />
            {v.type === "bool" ? (
              <label
                style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={v.default}
                  onChange={(e) =>
                    updateVariable(v.id, { default: e.target.checked } as Partial<Variable>)
                  }
                />
                default
              </label>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  value={v.options.join(", ")}
                  placeholder="opt1, opt2"
                  onChange={(e) => {
                    const options = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    updateVariable(v.id, {
                      options,
                      default: options.includes(v.default)
                        ? v.default
                        : options[0] ?? "",
                    } as Partial<Variable>);
                  }}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    background: "#111",
                    border: "1px solid var(--studio-border-strong)",
                    borderRadius: 4,
                    padding: "4px 6px",
                  }}
                />
                <select
                  value={v.default}
                  onChange={(e) =>
                    updateVariable(v.id, { default: e.target.value } as Partial<Variable>)
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    background: "#111",
                    border: "1px solid var(--studio-border-strong)",
                    borderRadius: 4,
                    padding: "4px 6px",
                  }}
                >
                  {v.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            type="button"
            className="mini-btn danger"
            onClick={(e) => {
              e.stopPropagation();
              removeVariable(v.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
