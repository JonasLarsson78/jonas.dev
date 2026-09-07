#!/bin/bash
# Deploy all Vite frontends to Vercel
# Run AFTER: vercel login

set -e

REPO="JonasLarsson78/joans.dev"

echo "🚀 Deploying all demos to Vercel production..."
echo ""

deploy() {
  local dir=$1
  local name=$2
  echo "── $name ($dir)"
  cd "$dir"
  url=$(vercel --prod --yes \
    --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" \
    --name "$name" \
    2>&1 | grep -E "^https://" | tail -1)
  echo "   ✅ $url"
  cd - > /dev/null
  echo "$name=$url"
}

ROOT=$(pwd)

cd "$ROOT/demos/vue"        && URL_VUE=$(vercel --prod --yes --name "jonas-demo-vue" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)        && echo "VUE:        $URL_VUE"
cd "$ROOT/demos/react"      && URL_REACT=$(vercel --prod --yes --name "jonas-demo-react" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)    && echo "REACT:      $URL_REACT"
cd "$ROOT/demos/typescript" && URL_TS=$(vercel --prod --yes --name "jonas-demo-ts" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)          && echo "TYPESCRIPT: $URL_TS"
cd "$ROOT/demos/graphql"    && URL_GQL=$(vercel --prod --yes --name "jonas-demo-graphql" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)    && echo "GRAPHQL:    $URL_GQL"
cd "$ROOT/demos/auth"       && URL_AUTH=$(vercel --prod --yes --name "jonas-demo-auth" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)      && echo "AUTH:       $URL_AUTH"
cd "$ROOT/demos/mysql"      && URL_MYSQL=$(vercel --prod --yes --name "jonas-demo-mysql" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)    && echo "MYSQL:      $URL_MYSQL"
cd "$ROOT/demos/docker"     && URL_DOCKER=$(vercel --prod --yes --name "jonas-demo-docker" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)  && echo "DOCKER:     $URL_DOCKER"
cd "$ROOT/demos/ai"         && URL_AI=$(vercel --prod --yes --name "jonas-demo-ai" --build-env VITE_PORTFOLIO_URL="https://jonas-dev-showcase.vercel.app" 2>&1 | grep "https://" | grep -v "Inspect" | tail -1)          && echo "AI:         $URL_AI"

cd "$ROOT"

echo ""
echo "══════════════════════════════════════════════════════════"
echo "Nu behöver du sätta dessa env-variabler i showcase-projektet:"
echo "Gå till: https://vercel.com/jonaslarsson78/jonas-dev-showcase/settings/environment-variables"
echo ""
echo "DEMO_VUE_URL         = $URL_VUE"
echo "DEMO_REACT_URL       = $URL_REACT"
echo "DEMO_TS_URL          = $URL_TS"
echo "DEMO_GRAPHQL_URL     = $URL_GQL"
echo "DEMO_AUTH_URL        = $URL_AUTH"
echo "DEMO_MYSQL_URL       = $URL_MYSQL"
echo "DEMO_DOCKER_URL      = $URL_DOCKER"
echo "DEMO_AI_URL          = $URL_AI"
echo ""
echo "Glöm inte DEMO_NODE_API_URL och DEMO_GRAPHQL_URL (Railway)"
echo "══════════════════════════════════════════════════════════"
