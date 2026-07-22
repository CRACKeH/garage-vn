import { useCallback, useEffect, useMemo, useState } from "react";
import { scenes } from "../data/chapter01";
import { Typewriter } from "./Typewriter";

type Props = {
  onExit: () => void;
};

export function NovelPlayer({ onExit }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [skipType, setSkipType] = useState(false);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [ending, setEnding] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);

  const scene = scenes[sceneIndex];
  const line = scene.lines[lineIndex];
  const atLastLine = lineIndex >= scene.lines.length - 1;
  const showChoices = Boolean(scene.choices && atLastLine && typingDone && !ending);

  const progress = useMemo(() => {
    const totalLines = scenes.reduce((sum, s) => sum + s.lines.length, 0);
    const done = scenes
      .slice(0, sceneIndex)
      .reduce((sum, s) => sum + s.lines.length, 0);
    return Math.round(((done + lineIndex + (typingDone ? 1 : 0)) / totalLines) * 100);
  }, [lineIndex, sceneIndex, typingDone]);

  const advance = useCallback(() => {
    if (ending) {
      onExit();
      return;
    }
    if (showChoices) return;

    if (!typingDone) {
      setSkipType(true);
      setTypingDone(true);
      return;
    }

    if (!atLastLine) {
      setLineIndex((i) => i + 1);
      setTypingDone(false);
      setSkipType(false);
      return;
    }

    if (sceneIndex < scenes.length - 1) {
      setSceneIndex((i) => i + 1);
      setLineIndex(0);
      setTypingDone(false);
      setSkipType(false);
      setImageReady(false);
    }
  }, [atLastLine, ending, onExit, sceneIndex, showChoices, typingDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        advance();
      }
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, onExit]);

  const speakerClass =
    line.kind === "narrator"
      ? "speaker narrator"
      : line.kind === "action"
        ? "speaker action"
        : line.speaker.includes("Монстр")
          ? "speaker monster"
          : "speaker";

  const horror = sceneIndex >= 6;

  return (
    <div
      className={`screen novel-screen${horror ? " horror" : ""}`}
      onClick={advance}
      role="presentation"
    >
      <div className="ink-noise" aria-hidden />
      <header className="novel-top">
        <button
          type="button"
          className="btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
        >
          ← в меню
        </button>
        <div className="progress-wrap" aria-label={`Прогресс ${progress}%`}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="scene-counter">
          {sceneIndex + 1}/{scenes.length}
        </span>
      </header>

      <div className={`cg-stage${imageReady ? " ready" : ""}`}>
        <img
          key={scene.image}
          src={scene.image}
          alt=""
          className="cg-image"
          onLoad={() => setImageReady(true)}
          draggable={false}
        />
        <div className="cg-vignette" aria-hidden />
      </div>

      <div
        className="dialogue-panel"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div className={speakerClass}>{line.speaker}</div>
        <p className={`dialogue-text kind-${line.kind ?? "dialog"}`}>
          <Typewriter
            key={`${scene.id}-${lineIndex}`}
            text={line.text}
            active={!skipType}
            onDone={() => setTypingDone(true)}
          />
          {typingDone && !showChoices && !ending && (
            <span className="continue-caret" aria-hidden>
              ▼
            </span>
          )}
        </p>

        {showChoices && scene.choices && (
          <div className="choices">
            {scene.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`choice-btn${choiceId === choice.id ? " picked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setChoiceId(choice.id);
                  setEnding(choice.result);
                }}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}

        {ending && (
          <div className="ending-box">
            <p>{ending}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onExit();
              }}
            >
              В меню
            </button>
          </div>
        )}

        {!showChoices && !ending && (
          <button type="button" className="btn-advance" onClick={advance}>
            Далее
          </button>
        )}
      </div>
    </div>
  );
}
