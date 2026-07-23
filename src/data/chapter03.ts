import type { Scene } from "./types";

export const CHAPTER_03_TITLE = "Глава 3. Приход";

export const scenes: Scene[] = [
  {
    id: "01",
    image: "/chapter03/ch03-01-door-shadow.png",
    mood: "panic",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Дверь распахнулась. На пороге стояла устрашающая фигура в тени — без лица, без имени, только контур чего-то неизведанного.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "…Бля.",
      },
    ],
  },
  {
    id: "02",
    image: "/chapter03/ch03-02-armed-screams.png",
    mood: "panic",
    lines: [
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Мы вооружены!",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Ты кто блядь такой!",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "У меня страпон и он готов к действию!",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Мы готовы разорвать твою задницу на кусочки!",
      },
    ],
  },
  {
    id: "03",
    image: "/chapter03/ch03-03-tyomka-reveal.png",
    mood: "cozy",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Тень шагнула в свет. В руках — кальянчик. За спиной — огромная колонка с надписью RATM.",
      },
      {
        speaker: "Тёмка",
        kind: "dialog",
        text: "Вы чё, чуваки? Это же я, Тёмка. И у меня есть пиздатый кальянчик, чтобы упороть вас сегодня.",
      },
    ],
  },
  {
    id: "04",
    image: "/chapter03/ch03-04-toss-tyomka.png",
    mood: "cozy",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Гараж взорвался криками радости. Тёмку подхватили на руки и начали подбрасывать к потолку, как кубок местного чемпионата.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "БРАААТ!",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Кальянчик! Колонка! Легенда жива!",
      },
    ],
  },
  {
    id: "05",
    image: "/chapter03/ch03-05-stoned-dji.png",
    mood: "haze",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Через час все сидели раскумаренные. Парные колонки DJI тихо мурлыкали. Кальян ходил по кругу. Мир стал мягким и немного кривым.",
      },
      {
        speaker: "Тёмка",
        kind: "dialog",
        text: "Вот это я понимаю — культурный вечер.",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Если бы каждое воскресенье так начиналось…",
      },
    ],
  },
  {
    id: "06",
    image: "/chapter03/ch03-06-vadim-51-tracks.png",
    mood: "horror",
    lines: [
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Чуваки… я вчера записал пятьдесят один тречок. Не хотите послушать?",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Он сказал это спокойно. Как человек, который предлагает чай. Или конец света.",
      },
    ],
  },
  {
    id: "07",
    image: "/chapter03/ch03-07-bloody-silence.png",
    mood: "horror",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "У всех проступил пот. Повисла кровавая тишина. Страх отпечатался на лицах быстрее, чем дым из кальяна.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "…Пятьдесят… один?",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Я видел смерть. Она была в формате mp3.",
      },
    ],
  },
  {
    id: "08",
    image: "/chapter03/ch03-08-just-kidding.png",
    mood: "cozy",
    lines: [
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Да шучу я. Всего лишь три трека, чуваки. В новом жанре классического инструментального электронного гремблинга))",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Все резко выдохнули так, будто им вернули право на жизнь.",
      },
      {
        speaker: "Тёмка",
        kind: "dialog",
        text: "Да, чувак, конечно. Погнали. Врубай на полную.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "На полную. Без вариантов.",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Разгоняй, бро, по полной!",
      },
    ],
  },
  {
    id: "09",
    image: "/chapter03/ch03-09-zhenek-mars.png",
    mood: "haze",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "И чуваки погрузились в космос.",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Женек резко очутился на Марсе — прыгал среди паровых машин, гари и невиданных корпоративных структур.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Это… что, Дринга Дранги Глинграгер?!",
      },
    ],
  },
  {
    id: "10",
    image: "/chapter03/ch03-10-oleg-tyomka-trip.png",
    mood: "haze",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Олег оказался в психоделическом мире, полном электрических схем и неопознанных биосуществ.",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Схема… живая… она на меня смотрит… 010110110100100101011010001",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "А Тёмка просто завис.............................",
      },
      {
        speaker: "Тёмка",
        kind: "dialog",
        text: "………………",
      },
    ],
    choices: [
      {
        id: "more",
        label: "Врубай следующий трек",
        result:
          "Колонки DJI взвыли. Космос стал глубже. Глава 3 окончена — трип продолжается.",
      },
      {
        id: "water",
        label: "Налить всем воды",
        result:
          "Кто-то протянул бутылку. Тёмка моргнул впервые за минуту. Глава 3 окончена.",
      },
      {
        id: "wake",
        label: "Попытаться проснуться",
        result:
          "Гараж мелькнул сквозь Марс и схемы… но музыка ещё играла. Глава 3 окончена.",
      },
    ],
  },
];
