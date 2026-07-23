# Гараж — визуальная новелла

Чёрно-белая треш-новелла. Главы 1–5.

## Играть онлайн (GitHub Pages)

После пуша в `CRACKeH/garage-vn` сайт будет здесь:

**https://crackeh.github.io/garage-vn/**

## Запуск локально

```bash
npm install
npm run dev
```

Игра: http://localhost:5173/garage-vn/  
**Scenario Studio** (только локально, не деплоится на Pages): http://localhost:5173/garage-vn/editor.html  
или `npm run editor`

В Studio можно строить главы → сцены → ноды, задавать переменные (bool/select), условия на фразах/кнопках, playtest и экспорт в `.garage.json` / TypeScript.

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

- `public/chapter01|02|03|04|05/` — CG
- `public/ambience/` — фоновые звуки по настроению сцены (CC0, см. `SOURCES.md`)
- `src/data/chapter*.ts` — тексты (легаси линейный формат)
- `src/data/runtimeTypes.ts` — runtime-граф (ноды, переменные, ветки)
- `src/editor/` — Scenario Studio
- `script/` — сценарий (markdown-драфты) + CG-промпты

## Амбиент

При старте главы и смене кадра звук плавно переключается под настроение: аллея → уют гаража → тревога → хоррор → паника / раскумар и т.д.
