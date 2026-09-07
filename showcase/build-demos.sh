#!/bin/bash
# Builds all Vite demos and copies them to showcase/public/demos/
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/showcase/public/demos"
mkdir -p "$OUT"

build() {
  local name=$1
  echo "▶ Building demos/$name..."
  (cd "$ROOT/demos/$name" && npm run build)
  rm -rf "$OUT/$name"
  cp -r "$ROOT/demos/$name/dist" "$OUT/$name"
  echo "  ✅ → public/demos/$name/"
}

build vue
build react
build ai
build typescript
build graphql
build auth
build mysql
build docker

echo ""
echo "All demos built ✅"
