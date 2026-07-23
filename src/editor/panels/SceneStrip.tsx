import { useProjectStore } from "../store/projectStore";

export function SceneStrip() {
  const chapter = useProjectStore((s) => s.getActiveChapter());
  const sceneId = useProjectStore((s) => s.sceneId);
  const selectScene = useProjectStore((s) => s.selectScene);
  const addScene = useProjectStore((s) => s.addScene);

  if (!chapter) return null;

  return (
    <div className="scene-strip">
      {chapter.scenes.map((sc, i) => (
        <button
          key={sc.id}
          type="button"
          className={`scene-chip${sc.id === sceneId ? " active" : ""}`}
          onClick={() => selectScene(sc.id)}
        >
          <span className="scene-chip-index">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="scene-chip-name">{sc.name}</span>
        </button>
      ))}
      <button type="button" className="scene-chip" onClick={addScene}>
        <span className="scene-chip-index">+</span>
        <span className="scene-chip-name">Scene</span>
      </button>
    </div>
  );
}
