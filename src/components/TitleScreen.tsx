import { chapters, GAME_SUBTITLE, GAME_TITLE } from "../data/story";

type Props = {
  onStart: (chapterIndex: number) => void;
};

export function TitleScreen({ onStart }: Props) {
  return (
    <div className="screen title-screen">
      <img
        className="title-bg"
        src={`${import.meta.env.BASE_URL}title-bg.png?v=all4`}
        alt=""
        aria-hidden
        draggable={false}
      />
      <div className="title-bg-shade" aria-hidden />
      <div className="ink-noise" aria-hidden />
      <div className="title-frame">
        <p className="title-kicker">visual novel</p>
        <h1 className="game-title">{GAME_TITLE}</h1>
        <p className="game-subtitle">{GAME_SUBTITLE}</p>
        <div className="title-rule" aria-hidden />
        <p className="title-blurb">
          Трое друзей. Один гараж. Шутки, которые лучше не повторять слишком
          часто.
        </p>
        <div className="chapter-list">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              className={index === 0 ? "btn-primary" : "choice-btn chapter-start"}
              onClick={() => onStart(index)}
            >
              {index === 0 ? "Начать с главы 1" : chapter.title}
            </button>
          ))}
        </div>
        <p className="title-hint">клик / пробел / → — дальше</p>
      </div>
    </div>
  );
}
