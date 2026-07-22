import { useState } from "react";
import { TitleScreen } from "./components/TitleScreen";
import { NovelPlayer } from "./components/NovelPlayer";

type Screen = "title" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");

  if (screen === "title") {
    return <TitleScreen onStart={() => setScreen("game")} />;
  }

  return <NovelPlayer onExit={() => setScreen("title")} />;
}
