import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EditorApp } from "./EditorApp";
import { loadProjectFromIdb } from "./persist/idb";
import { useProjectStore } from "./store/projectStore";

async function boot() {
  try {
    const saved = await loadProjectFromIdb();
    if (saved && saved.version === 1) {
      useProjectStore.getState().setProject(saved);
    }
  } catch {
    // ignore — use seeded legacy project
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <EditorApp />
    </StrictMode>,
  );
}

boot();
