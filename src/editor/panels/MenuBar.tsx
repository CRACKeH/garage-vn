import { useRef } from "react";
import {
  exportAllChaptersTs,
  exportProjectJson,
} from "../export/toRuntime";
import { createProjectFromLegacy, emptyProject } from "../import/fromLegacy";
import { clearIdbProject, saveProjectToIdb } from "../persist/idb";
import {
  resetToEmpty,
  resetToLegacy,
  useProjectStore,
} from "../store/projectStore";

export function MenuBar() {
  const project = useProjectStore((s) => s.project);
  const dirty = useProjectStore((s) => s.dirty);
  const markClean = useProjectStore((s) => s.markClean);
  const setProject = useProjectStore((s) => s.setProject);
  const setPlaytestOpen = useProjectStore((s) => s.setPlaytestOpen);
  const addNode = useProjectStore((s) => s.addNode);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    await saveProjectToIdb(project);
    markClean();
  };

  const loadFile = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data?.version !== 1) {
      alert("Неподдерживаемый формат .garage.json");
      return;
    }
    setProject(data);
    await saveProjectToIdb(data);
  };

  return (
    <header className="studio-menubar">
      <div className="studio-brand">
        <span className="studio-brand-dot" />
        Scenario Studio
      </div>

      <button type="button" className="menu-btn" onClick={() => void save()}>
        Save
      </button>
      <button
        type="button"
        className="menu-btn"
        onClick={() => {
          exportProjectJson(project);
        }}
      >
        Export JSON
      </button>
      <button
        type="button"
        className="menu-btn"
        onClick={() => exportAllChaptersTs(project)}
      >
        Export TS
      </button>
      <button
        type="button"
        className="menu-btn"
        onClick={() => fileRef.current?.click()}
      >
        Open…
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,.garage.json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void loadFile(f);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        className="menu-btn"
        onClick={() => {
          if (confirm("Загрузить легаси-главы из игры?")) {
            resetToLegacy();
            void saveProjectToIdb(createProjectFromLegacy());
          }
        }}
      >
        Import Legacy
      </button>
      <button
        type="button"
        className="menu-btn"
        onClick={() => {
          if (confirm("Новый пустой проект?")) {
            resetToEmpty();
            void clearIdbProject();
            void saveProjectToIdb(emptyProject());
          }
        }}
      >
        New
      </button>

      <button type="button" className="menu-btn" onClick={() => addNode()}>
        + Node
      </button>

      <div className="menu-spacer" />

      <span className="menu-status">{dirty ? "unsaved" : "saved"}</span>
      <button
        type="button"
        className="menu-btn primary"
        onClick={() => setPlaytestOpen(true)}
      >
        ▶ Playtest
      </button>
    </header>
  );
}
