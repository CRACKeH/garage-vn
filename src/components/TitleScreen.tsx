import { CHAPTER_TITLE, GAME_SUBTITLE, GAME_TITLE } from "../data/chapter01";

type Props = {
  onStart: () => void;
};

export function TitleScreen({ onStart }: Props) {
  return (
    <div className="screen title-screen">
      <div className="ink-noise" aria-hidden />
      <div className="title-frame">
        <p className="title-kicker">visual novel</p>
        <h1 className="game-title">{GAME_TITLE}</h1>
        <p className="game-subtitle">{GAME_SUBTITLE}</p>
        <div className="title-rule" aria-hidden />
        <p className="chapter-label">{CHAPTER_TITLE}</p>
        <p className="title-blurb">
          Трое друзей. Один гараж. Шутки, которые лучше не повторять слишком
          часто.
        </p>
        <button type="button" className="btn-primary" onClick={onStart}>
          Начать главу
        </button>
        <p className="title-hint">клик / пробел / → — дальше</p>
      </div>
    </div>
  );
}
