import { useState } from "react";
import { setAmbience, unlockAmbience } from "./audio/ambience";
import { startBgMusic } from "./audio/bgMusic";
import { TitleScreen } from "./components/TitleScreen";
import { NovelPlayer } from "./components/NovelPlayer";
import { chapters } from "./data/story";

type Screen = "title" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [chapterIndex, setChapterIndex] = useState(0);

  if (screen === "title") {
    return (
      <TitleScreen
        onStart={(index) => {
          unlockAmbience();
          startBgMusic();
          setChapterIndex(index);
          setScreen("game");
        }}
      />
    );
  }

  const chapter = chapters[chapterIndex];
  const hasNext = chapterIndex < chapters.length - 1;

  return (
    <NovelPlayer
      key={chapter.id}
      chapter={chapter}
      horrorFromIndex={chapter.id === "02" ? 8 : chapter.id === "03" ? 6 : 6}
      onExit={() => {
        setAmbience("alley");
        setScreen("title");
      }}
      completeLabel={hasNext ? `${chapters[chapterIndex + 1].title} →` : "В меню"}
      onComplete={() => {
        if (hasNext) {
          setChapterIndex((i) => i + 1);
          return;
        }
        setAmbience("alley");
        setScreen("title");
      }}
    />
  );
}
