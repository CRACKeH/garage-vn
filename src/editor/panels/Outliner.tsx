import { useProjectStore } from "../store/projectStore";

export function Outliner() {
  const project = useProjectStore((s) => s.project);
  const chapterId = useProjectStore((s) => s.chapterId);
  const sceneId = useProjectStore((s) => s.sceneId);
  const selectChapter = useProjectStore((s) => s.selectChapter);
  const selectScene = useProjectStore((s) => s.selectScene);
  const addChapter = useProjectStore((s) => s.addChapter);
  const addScene = useProjectStore((s) => s.addScene);
  const removeChapter = useProjectStore((s) => s.removeChapter);
  const removeScene = useProjectStore((s) => s.removeScene);
  const renameChapter = useProjectStore((s) => s.renameChapter);
  const renameScene = useProjectStore((s) => s.renameScene);
  const updateProjectName = useProjectStore((s) => s.updateProjectName);

  const chapter = project.chapters.find((c) => c.id === chapterId);

  return (
    <div className="panel-scroll">
      <div className="tree-section">
        <p className="tree-label">Project</p>
        <div className="field">
          <input
            value={project.name}
            onChange={(e) => updateProjectName(e.target.value)}
          />
        </div>
      </div>

      <div className="tree-section">
        <p className="tree-label">Chapters</p>
        {project.chapters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className={`tree-item${ch.id === chapterId ? " active" : ""}`}
            onClick={() => selectChapter(ch.id)}
            onDoubleClick={() => {
              const title = prompt("Название главы", ch.title);
              if (title) renameChapter(ch.id, title);
            }}
          >
            {ch.title}
          </button>
        ))}
        <div className="tree-actions">
          <button type="button" className="mini-btn" onClick={addChapter}>
            + Chapter
          </button>
          <button
            type="button"
            className="mini-btn danger"
            onClick={() => removeChapter(chapterId)}
          >
            −
          </button>
        </div>
      </div>

      <div className="tree-section">
        <p className="tree-label">Scenes</p>
        {chapter?.scenes.map((sc) => (
          <button
            key={sc.id}
            type="button"
            className={`tree-item nested${sc.id === sceneId ? " active" : ""}`}
            onClick={() => selectScene(sc.id)}
            onDoubleClick={() => {
              const name = prompt("Название сцены", sc.name);
              if (name) renameScene(sc.id, name);
            }}
          >
            {sc.name}
            <span style={{ color: "var(--studio-muted)", marginLeft: "auto" }}>
              {sc.nodes.length}
            </span>
          </button>
        ))}
        <div className="tree-actions">
          <button type="button" className="mini-btn" onClick={addScene}>
            + Scene
          </button>
          <button
            type="button"
            className="mini-btn danger"
            onClick={() => removeScene(sceneId)}
          >
            −
          </button>
        </div>
      </div>

      <div className="tree-section">
        <p className="tree-label">Characters</p>
        {project.characters.map((c) => (
          <div key={c.id} className="tree-item" style={{ cursor: "default" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: c.color,
                flexShrink: 0,
              }}
            />
            {c.name}
          </div>
        ))}
      </div>

      {project.groups.length > 0 && (
        <div className="tree-section">
          <p className="tree-label">Groups</p>
          {project.groups.map((g) => (
            <div key={g.id} className="tree-item" style={{ cursor: "default" }}>
              {g.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
