import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Project } from "../model/types";

interface StudioDb extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      updatedAt: number;
      project: Project;
    };
  };
}

const DB_NAME = "garage-scenario-studio";
const STORE = "projects";
const CURRENT_KEY = "current";

let dbPromise: Promise<IDBPDatabase<StudioDb>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<StudioDb>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE, { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

export async function saveProjectToIdb(project: Project): Promise<void> {
  const db = await getDb();
  await db.put(STORE, {
    id: CURRENT_KEY,
    updatedAt: Date.now(),
    project,
  });
}

export async function loadProjectFromIdb(): Promise<Project | null> {
  const db = await getDb();
  const row = await db.get(STORE, CURRENT_KEY);
  return row?.project ?? null;
}

export async function clearIdbProject(): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, CURRENT_KEY);
}
