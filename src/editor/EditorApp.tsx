import { useEffect } from "react";
import "./editor.css";
import { MediaBrowser } from "./panels/MediaBrowser";
import { MenuBar } from "./panels/MenuBar";
import { Outliner } from "./panels/Outliner";
import { Inspector } from "./panels/Inspector";
import { VariablesPanel } from "./panels/Variables";
import { SceneStrip } from "./panels/SceneStrip";
import { NodeCanvas } from "./canvas/NodeCanvas";
import { PlaytestOverlay } from "./panels/Playtest";
import { saveProjectToIdb } from "./persist/idb";
import { useProjectStore } from "./store/projectStore";

export function EditorApp() {
  const playtestOpen = useProjectStore((s) => s.playtestOpen);
  const projectName = useProjectStore((s) => s.project.name);
  const dirty = useProjectStore((s) => s.dirty);
  const project = useProjectStore((s) => s.project);
  const markClean = useProjectStore((s) => s.markClean);
  const chapterId = useProjectStore((s) => s.chapterId);
  const sceneId = useProjectStore((s) => s.sceneId);
  const selectionKind = useProjectStore((s) => s.selection.kind);

  useEffect(() => {
    if (!dirty) return;
    const t = window.setTimeout(() => {
      void saveProjectToIdb(project).then(markClean);
    }, 1200);
    return () => window.clearTimeout(t);
  }, [dirty, project, markClean]);

  // Keep an entry node selected so Inspector (and Browse) stay visible.
  useEffect(() => {
    if (selectionKind === "node") return;
    const state = useProjectStore.getState();
    const scene = state.getActiveScene();
    const entry = scene?.entryNodeId ?? scene?.nodes[0]?.id;
    if (entry) state.selectNode(entry);
  }, [chapterId, sceneId, selectionKind]);

  return (
    <div className="studio">
      <MenuBar />
      <div className="studio-body">
        <aside className="studio-left">
          <div className="panel-header">Outliner</div>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex" }}>
              <Outliner />
            </div>
            <div className="panel-header">Media</div>
            <div style={{ flex: "0 0 220px", minHeight: 0, overflow: "hidden", display: "flex" }}>
              <MediaBrowser />
            </div>
          </div>
        </aside>
        <main className="studio-center">
          <div className="canvas-header">
            <span className="canvas-title">
              {projectName}
              {dirty ? " •" : ""}
            </span>
            <span className="canvas-hint">Tab — нода · Del — удалить · Space — playtest</span>
          </div>
          <div className="canvas-wrap">
            <NodeCanvas />
          </div>
          <SceneStrip />
        </main>
        <aside className="studio-right">
          <div className="studio-right-top">
            <div className="panel-header">Inspector</div>
            <Inspector />
          </div>
          <div className="studio-right-bottom">
            <div className="panel-header">Variables</div>
            <VariablesPanel />
          </div>
        </aside>
      </div>
      {playtestOpen && <PlaytestOverlay />}
    </div>
  );
}
