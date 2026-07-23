#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "Собираю dist…"
npm ci
npm run build

echo "Публикую ветку gh-pages…"
npx --yes gh-pages@6 -d dist -b gh-pages

echo
echo "В GitHub → Settings → Pages:"
echo "  Source: Deploy from a branch"
echo "  Branch: gh-pages / (root)"
echo
echo "Сайт: https://crackeh.github.io/garage-vn/"
