import { useCallback, useEffect, useMemo, useState } from "react";
import { setAmbience } from "../audio/ambience";
import type { Mood } from "../data/types";
import {
  initVars,
  visibleButtons,
  visiblePhrases,
  type RuntimeChapter,
  type RuntimeNode,
  type VarState,
} from "../data/runtimeTypes";
import { toRuntimeChapter } from "../data/legacyToRuntime";
import type { Chapter } from "../data/types";
import { assetUrl } from "../assetUrl";
import { Typewriter } from "./Typewriter";

type Props = {
  chapter: Chapter | RuntimeChapter;
  onExit: () => void;
  onComplete?: () => void;
  completeLabel?: string;
  horrorFromIndex?: number;
  /** Optional live vars mirror for editor playtest */
  onVarsChange?: (vars: VarState, nodeId: string) => void;
};

function findNode(chapter: RuntimeChapter, id: string): RuntimeNode | undefined {
  return chapter.nodes.find((n) => n.id === id);
}

export function NovelPlayer({
  chapter: chapterInput,
  onExit,
  onComplete,
  completeLabel = "В меню",
  horrorFromIndex = 6,
  onVarsChange,
}: Props) {
  const chapter = useMemo(() => toRuntimeChapter(chapterInput), [chapterInput]);
  const [nodeId, setNodeId] = useState(chapter.entryNodeId);
  const [lineIndex, setLineIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [skipType, setSkipType] = useState(false);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [ending, setEnding] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [vars, setVars] = useState<VarState>(() => initVars(chapter.variables));
  const [visited, setVisited] = useState(0);

  const node = findNode(chapter, nodeId);
  const phrases = useMemo(
    () => (node ? visiblePhrases(node, vars) : []),
    [node, vars],
  );
  const line = phrases[lineIndex];
  const buttons = useMemo(
    () => (node ? visibleButtons(node, vars) : []),
    [node, vars],
  );
  const atLastLine = phrases.length === 0 || lineIndex >= phrases.length - 1;
  const showChoices = Boolean(
    buttons.length > 0 && atLastLine && (typingDone || phrases.length === 0) && !ending,
  );

  useEffect(() => {
    if (phrases.length === 0) {
      setTypingDone(true);
    }
  }, [phrases.length, nodeId]);

  const progress = useMemo(() => {
    const total = Math.max(chapter.nodes.length, 1);
    const nodeIndex = Math.max(
      0,
      chapter.nodes.findIndex((n) => n.id === nodeId),
    );
    // Monotonic: when a line finishes, +1; advancing to the next line
    // bumps lineIndex while typingDone resets — net stays flat, never goes back.
    const linePart =
      phrases.length > 0
        ? (lineIndex + (typingDone ? 1 : 0)) / phrases.length
        : typingDone
          ? 1
          : 0;
    const raw = ((nodeIndex + Math.min(linePart, 0.999)) / total) * 100;
    return Math.min(100, Math.round(raw));
  }, [chapter.nodes, lineIndex, nodeId, phrases.length, typingDone]);

  useEffect(() => {
    onVarsChange?.(vars, nodeId);
  }, [vars, nodeId, onVarsChange]);

  const finish = useCallback(() => {
    if (onComplete) onComplete();
    else onExit();
  }, [onComplete, onExit]);

  const goToNext = useCallback(
    (next: string, resultText?: string) => {
      if (next === "__end__" || resultText) {
        setEnding(resultText ?? "Глава окончена.");
        return;
      }
      if (next.startsWith("__chapter__:")) {
        finish();
        return;
      }
      if (next.startsWith("__scene__:")) {
        // unresolved scene jump — treat as end
        setEnding("Переход к сцене недоступен в этом билде.");
        return;
      }
      const target = findNode(chapter, next);
      if (!target) {
        setEnding("Следующая нода не найдена.");
        return;
      }
      setNodeId(next);
      setLineIndex(0);
      setTypingDone(false);
      setSkipType(false);
      setChoiceId(null);
      setImageReady(false);
      setVisited((v) => v + 1);
    },
    [chapter, finish],
  );

  const advance = useCallback(() => {
    if (ending) {
      finish();
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
    if (node?.next) {
      goToNext(node.next);
    }
  }, [atLastLine, ending, finish, goToNext, node?.next, showChoices, typingDone]);

  useEffect(() => {
    const mood = (node?.mood as Mood | undefined) ?? "cozy";
    setAmbience(mood);
  }, [node?.mood]);

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

  if (!node) {
    return (
      <div className="screen novel-screen">
        <p>Нода не найдена.</p>
        <button type="button" className="btn-primary" onClick={onExit}>
          Назад
        </button>
      </div>
    );
  }

  const speakerClass =
    !line
      ? "speaker"
      : line.kind === "narrator"
        ? "speaker narrator"
        : line.kind === "action"
          ? "speaker action"
          : line.speaker.includes("Монстр")
            ? "speaker monster"
            : "speaker";

  const horror =
    visited >= horrorFromIndex ||
    node.animation === "horrorFlicker" ||
    node.mood === "horror" ||
    node.mood === "panic";

  const animClass = node.animation && node.animation !== "none" ? ` anim-${node.animation}` : "";

  return (
    <div
      className={`screen novel-screen${horror ? " horror" : ""}${animClass}`}
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
        <span className="chapter-chip">{chapter.title}</span>
        <div className="progress-wrap" aria-label={`Прогресс ${progress}%`}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="scene-counter">{node.name ?? node.id}</span>
      </header>

      <div className={`cg-stage${imageReady ? " ready" : ""}`}>
        {node.image ? (
          <img
            key={node.image}
            src={assetUrl(node.image)}
            alt=""
            className="cg-image"
            onLoad={() => setImageReady(true)}
            draggable={false}
          />
        ) : (
          <div className="cg-image cg-placeholder" />
        )}
        <div className="cg-vignette" aria-hidden />
      </div>

      <div
        className="dialogue-panel"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        {line ? (
          <>
            <div className={speakerClass}>{line.speaker}</div>
            <p className={`dialogue-text kind-${line.kind ?? "dialog"}`}>
              <Typewriter
                key={`${chapter.id}-${node.id}-${lineIndex}`}
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
          </>
        ) : (
          <p className="dialogue-text kind-narrator">
            {typingDone ? null : null}
            <span className="continue-caret" aria-hidden>
              ▼
            </span>
          </p>
        )}

        {showChoices && (
          <div className="choices">
            {buttons.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`choice-btn${choiceId === choice.id ? " picked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setChoiceId(choice.id);
                  if (choice.set) {
                    setVars((v) => ({ ...v, ...choice.set }));
                  }
                  goToNext(choice.next, choice.resultText);
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
                finish();
              }}
            >
              {completeLabel}
            </button>
          </div>
        )}

        {!showChoices && !ending && (node.next || !atLastLine || !typingDone) && (
          <button type="button" className="btn-advance" onClick={advance}>
            Далее
          </button>
        )}

        {!showChoices && !ending && !node.next && atLastLine && typingDone && buttons.length === 0 && (
          <button
            type="button"
            className="btn-advance"
            onClick={(e) => {
              e.stopPropagation();
              setEnding("Глава окончена.");
            }}
          >
            Завершить
          </button>
        )}
      </div>
    </div>
  );
}
