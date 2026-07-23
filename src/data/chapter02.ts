import type { Scene } from "./types";

export const CHAPTER_02_TITLE = "Глава 2. Похмелье";

export const scenes: Scene[] = [
  {
    id: "01",
    image: "/chapter02/ch02-01-vadim-wakes.png",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Утро в гараже пахло как преступление против печени.",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "…бл… который час…",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Вадим открыл один глаз. Потом второй. Оба сразу пожалели об этом решении.",
      },
    ],
  },
  {
    id: "02",
    image: "/chapter02/ch02-02-waking-him.png",
    lines: [
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Вставай, нигас. Мы тебя уже двадцать минут реанимируем взглядом.",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Он живой. Просто очень разочарованный жизнью.",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Заткнитесь чуваки, я ща блювану...",
      },
    ],
  },
  {
    id: "03",
    image: "/chapter02/ch02-03-bottle-aftermath.png",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Три бутылки виски, вино, пиво. Тусили до шести утра.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Вчера мы были легендами. Сегодня — биоотходы.",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Зато честно. Никто не притворялся, что «только по одной».",
      },
    ],
  },
  {
    id: "04",
    image: "/chapter02/ch02-04-scared-story.png",
    lines: [
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Короче… мне приснилось. Я что-то бормотал во сне, да?",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Ага. Типа какие-то тухлые заклинания.",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Там… Олег… превратился.... эээ, я не знаю как правильно описать это.",
      },
    ],
  },
  {
    id: "05",
    image: "/chapter02/ch02-05-dream-monster.png",
    lines: [
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "В супер мега гея. Огромного. С той же бородой. Финальный босс прайда и ада.",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "…",
      },
    ],
  },
  {
    id: "06",
    image: "/chapter02/ch02-06-gey-exchange.png",
    lines: [
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Ты чё гей?",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "Ну гей то ты).",
      },
    ],
  },
  {
    id: "07",
    image: "/chapter02/ch02-07-all-laugh.png",
    lines: [
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Гараж взорвался ржакой.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Супер мега гей— хахаха— Я всегда подозревал мэн, что ты за правое дело!",
      },
      {
        speaker: "Олег",
        kind: "dialog",
        text: "Вадим, ну я как бы и никогда не отрицал, что я готов насадить ваши бедные попяндры на свой ореховый шашлык.",
      },
    ],
  },
  {
    id: "08",
    image: "/chapter02/ch02-08-zhenek-rant.png",
    lines: [
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Не, парни.. А вдруг мы на самом деле все супер мега геи?",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Что мы тут делаем каждые выходные? Может, геемся и не подозреваем?",
      },
      {
        speaker: "Вадим",
        kind: "dialog",
        text: "…Ты сейчас угараешь? Или это продолжение того кошмара? ахаха",
      },
    ],
  },
  {
    id: "09",
    image: "/chapter02/ch02-09-grab-weapons.png",
    lines: [
      {
        speaker: "…",
        kind: "action",
        text: "ТУК-ТУК-ТУК.",
      },
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Оружие. Тихо. По углам.",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Бас-гитара. Кочерга. Топор в красной изоленте. Всё что нужно для борьбы с нечистью.",
      },
    ],
  },
  {
    id: "10",
    image: "/chapter02/ch02-10-zhenek-to-door.png",
    lines: [
      {
        speaker: "Женек",
        kind: "dialog",
        text: "Я открою. Если что — не поминайте натуралом.",
      },
      {
        speaker: "Нарратор",
        kind: "narrator",
        text: "Женек шагнул к двери первым. Рука на ручке.",
      },
    ],
    choices: [
      {
        id: "open",
        label: "Открыть дверь",
        result:
          "Женек дёрнул ручку. Щелчок замка прозвучал громче любого стука. Глава 2 окончена — дверь сейчас откроется.",
      },
      {
        id: "ask",
        label: "Спросить: «Кто там?»",
        result:
          "«Кто там?» — сорвалось у Женька. За дверью секунду молчали… а потом тихо хихикнули. Глава 2 окончена.",
      },
      {
        id: "wait",
        label: "Не открывать. Ждать.",
        result:
          "Они замерли с гитарой, кочергой и топором. Стучать перестали. Хуже ли это — ещё вопрос. Глава 2 окончена.",
      },
    ],
  },
];
