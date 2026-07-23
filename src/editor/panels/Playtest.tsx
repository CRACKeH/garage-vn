import { useCallback, useMemo, useState } from "react";
import { NovelPlayer } from "../../components/NovelPlayer";
import "../../styles.css";
import { compileChapter } from "../export/toRuntime";
import { useProjectStore } from "../store/projectStore";
import type { VarState } from "../../data/runtimeTypes";

export function PlaytestOverlay() {
  const project = useProjectStore((s) => s.project);
  const chapterId = useProjectStore((s) => s.chapterId);
  const setPlaytestOpen = useProjectStore((s) => s.setPlaytestOpen);
  const [liveVars, setLiveVars] = useState<VarState>({});
  const [liveNode, setLiveNode] = useState("");

  const runtime = useMemo(
    () => compileChapter(project, chapterId),
    [project, chapterId],
  );

  const onVarsChange = useCallback((vars: VarState, nodeId: string) => {
    setLiveVars(vars);
    setLiveNode(nodeId);
  }, []);

  if (!runtime) {
    return (
      <div className="playtest-overlay">
        <div className="playtest-stage" style={{ padding: 24 }}>
          Нечего тестировать — пустая глава.
        </div>
        <div className="playtest-side">
          <button
            type="button"
            className="menu-btn primary playtest-close"
            onClick={() => setPlaytestOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="playtest-overlay">
      <div className="playtest-stage">
        <NovelPlayer
          key={runtime.entryNodeId}
          chapter={runtime}
          onExit={() => setPlaytestOpen(false)}
          onComplete={() => setPlaytestOpen(false)}
          completeLabel="Закрыть playtest"
          onVarsChange={onVarsChange}
        />
      </div>
      <aside className="playtest-side">
        <h3>Live vars</h3>
        <p style={{ color: "var(--studio-muted)", marginTop: 0 }}>
          node: {liveNode || "—"}
        </p>
        {runtime.variables.length === 0 && (
          <p style={{ color: "var(--studio-muted)" }}>Нет переменных</p>
        )}
        {runtime.variables.map((v) => (
          <div key={v.id} className="var-row" style={{ cursor: "default" }}>
            <div>
              <div className="var-type">{v.name}</div>
              <div className="var-live">{String(liveVars[v.id] ?? v.default)}</div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="menu-btn primary playtest-close"
          onClick={() => setPlaytestOpen(false)}
        >
          Close (Esc)
        </button>
      </aside>
    </div>
  );
}
