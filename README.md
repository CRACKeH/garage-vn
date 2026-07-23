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

```bash
gh auth login
gh repo create garage-vn --public --source=. --remote=origin --push
```

В GitHub → **Settings → Pages → Source: GitHub Actions**.  
Workflow `.github/workflows/deploy-pages.yml` задеплоит сам после пуша в `master`.

## Управление

- **Клик / Пробел / → / Enter** — дальше
- **Esc** — в меню

## Структура

- `public/chapter01|02|03/` — CG
- `src/data/chapter*.ts` — тексты
- `script/` — сценарий
