#!/usr/bin/env bash
# Build and upload a release to PyPI from a fresh clone, inside a throwaway container.
# Avoids stale local build/ and dist/ directories ending up in (or being re-uploaded with) the release.
#
# Usage: ./release-docker.sh [branch-or-tag]   (default: main)
# Credentials: ~/.pypirc if present, otherwise TWINE_PASSWORD (and optionally TWINE_USERNAME) from the environment.
set -euo pipefail

REF="${1:-main}"
REPO_URL="https://github.com/overcastsoftware/wagtailcharts"

auth=()
if [ -f "$HOME/.pypirc" ]; then
  auth+=(-v "$HOME/.pypirc:/root/.pypirc:ro")
elif [ -n "${TWINE_PASSWORD:-}" ]; then
  auth+=(-e "TWINE_USERNAME=${TWINE_USERNAME:-__token__}" -e TWINE_PASSWORD)
else
  echo "No ~/.pypirc and no TWINE_PASSWORD set, so there is no way to authenticate to PyPI." >&2
  exit 1
fi

interactive=-i
[ -t 0 ] && interactive=-it

docker run --rm "$interactive" "${auth[@]}" -e REF="$REF" -e REPO_URL="$REPO_URL" python:3.13 bash -c '
  set -euo pipefail
  git clone --quiet --depth 1 --branch "$REF" "$REPO_URL" /w
  cd /w
  pip install --quiet --disable-pip-version-check --root-user-action=ignore build twine
  ./build.sh
  twine check dist/*
  echo
  ls dist/
  read -r -p "Upload these files to PyPI? [y/N] " answer
  [ "$answer" = "y" ] || { echo "Aborted, nothing uploaded."; exit 1; }
  ./release.sh
'
