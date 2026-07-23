import { scenes as chapter01Scenes, CHAPTER_TITLE as chapter01Title } from "./chapter01";
import { scenes as chapter02Scenes, CHAPTER_02_TITLE } from "./chapter02";
import { scenes as chapter03Scenes, CHAPTER_03_TITLE } from "./chapter03";
import { scenes as chapter04Scenes, CHAPTER_04_TITLE } from "./chapter04";
import { scenes as chapter05Scenes, CHAPTER_05_TITLE } from "./chapter05";
import type { Chapter } from "./types";

export const GAME_TITLE = "ГАРАЖ";
export const GAME_SUBTITLE = "чёрно-белый треш • визуальная новелла";

export const chapters: Chapter[] = [
  {
    id: "01",
    title: chapter01Title,
    scenes: chapter01Scenes,
  },
  {
    id: "02",
    title: CHAPTER_02_TITLE,
    scenes: chapter02Scenes,
  },
  {
    id: "03",
    title: CHAPTER_03_TITLE,
    scenes: chapter03Scenes,
  },
  {
    id: "04",
    title: CHAPTER_04_TITLE,
    scenes: chapter04Scenes,
  },
  {
    id: "05",
    title: CHAPTER_05_TITLE,
    scenes: chapter05Scenes,
  },
];
