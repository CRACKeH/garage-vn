# Гараж — визуальная новелла

Чёрно-белая треш-новелла. Главы 1–3.

## Играть онлайн (GitHub Pages)

После пуша в `CRACKeH/garage-vn` сайт будет здесь:

**https://crackeh.github.io/garage-vn/**

## Запуск локально

```bash
npm install
npm run dev
```

## Деплой на GitHub Pages

Важно: Pages должен отдавать **сборку** (`dist`), а не исходники с `master`.
Иначе в консоли будет `GET /src/main.tsx 404`.

### Вариант A — одной командой локально

```bash
npm run build
npx gh-pages -d dist -b gh-pages
```

Потом: **Settings → Pages → Branch: `gh-pages` / root**

### Вариант B — через GitHub Actions

Пуш в `master` запускает workflow, который публикует `dist` в `gh-pages`.
В Settings → Pages тоже выбери ветку **`gh-pages`**.

Сайт: **https://crackeh.github.io/garage-vn/**
## Управление

- **Клик / Пробел / → / Enter** — дальше
- **Esc** — в меню

## Структура

- `public/chapter01|02|03/` — CG
- `src/data/chapter*.ts` — тексты
- `script/` — сценарий
