#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

REPO_NAME="garage-vn"
OWNER="${GITHUB_USER:-CRACKeH}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Установи GitHub CLI: brew install gh"
  exit 1
fi

gh auth status || gh auth login

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  git push -u origin HEAD
fi

echo "Включи Pages: https://github.com/${OWNER}/${REPO_NAME}/settings/pages"
echo "Source → GitHub Actions"
echo "Сайт: https://$(echo "$OWNER" | tr '[:upper:]' '[:lower:]').github.io/${REPO_NAME}/"
