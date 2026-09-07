#!/bin/bash
set -e
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Building demos..."
bash "$REPO_ROOT/showcase/build-demos.sh"

echo "==> Building Nuxt showcase..."
cd "$REPO_ROOT/showcase"
npx nuxt build

echo "==> Done!"
