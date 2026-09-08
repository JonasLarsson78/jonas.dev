# jonas.dev — Interactive Developer Portfolio

An interactive portfolio built as a monorepo of live tech demos. Instead of listing skills on a CV, every technology is showcased with a small working app in that stack — click around and see the code, not just claims about it.

**Live:** [jonas.dev](https://jonas.dev)

---

## What this is

The main site (built with **Nuxt 3**) is the landing page and demo catalog. Each demo lives in its own workspace under `demos/` and is a standalone app built with the tech it represents. On deploy, every demo is compiled and served under `/demos/<name>/` from the same Nuxt app.

- **Root** = Nuxt 3 showcase site (the page you land on)
- **`demos/*`** = individual apps, each in its own tech stack
- **`showcase/public/demos/`** = compiled demo output (built by `showcase/build-demos.sh`)

---

## The demos

### Frontend

| # | Demo | Stack | What it shows |
|---|---|---|---|
| 1 | **Nuxt 3** | SSR, file routing, composables, API routes | The showcase site itself — this page. |
| 2 | **Vue 3** | Composition API, `<script setup>`, Pinia, Vite | A Kanban task board with drag & drop and typed stores. |
| 3 | **React** | Hooks, Context API, TypeScript, Vite | An analytics dashboard with custom hooks and data viz. |
| 4 | **Svelte 4** | Stores, transitions, `animate:flip`, compiled | A reactive task board — no virtual DOM, compiled to vanilla JS. |
| 5 | **TypeScript** | Generics, utility types, discriminated unions, type guards | Interactive walkthrough of the TS patterns used across the portfolio. |
| 6 | **SCSS** | Variables, nesting, mixins, `@each`, Flexbox/Grid | Interactive playground for the SCSS patterns used across the site. |
| 7 | **Vitest** | `@vue/test-utils`, Pinia testing, coverage | Animated test runner UI showing real Vue component + store tests. |

### Backend

| # | Demo | Stack | What it shows |
|---|---|---|---|
| 8 | **Node.js** | Express, TypeScript, JWT, CORS, SQLite | REST API — the backbone that powers most demos. |
| 9 | **GraphQL** | `graphql-yoga`, SDL schema, resolvers | Fully typed schema with queries, mutations, enums, nested resolvers, filtering. Includes interactive query builder. |
| 10 | **JWT + OAuth2** | `jsonwebtoken`, Express, TypeScript | Log in, decode a JWT, hit a protected endpoint, walk the OAuth2 auth-code flow step by step. |
| 11 | **MySQL** | SQL, `better-sqlite3`, JOINs, aggregates | Real SQL against SQLite (MySQL-compatible): schema with FKs and indexes, `INNER JOIN`, `GROUP BY`. |
| 12 | **MongoDB** | Documents, Mongoose, aggregation, `populate()` | NoSQL side-by-side with SQL — the same domain modeled two ways. |

### AI

| # | Demo | Stack | What it shows |
|---|---|---|---|
| 13 | **Claude API** | Vue 3 frontend, Node.js proxy, SSE streaming | Streaming chat assistant. The API key stays server-side — the client never sees it. |

### DevOps

| # | Demo | Stack | What it shows |
|---|---|---|---|
| 14 | **Docker** | Dockerfile, Compose, multi-stage, nginx | Production-ready Dockerfiles for every service, orchestrated with Compose. Healthchecks + secret injection. |
| 15 | **GitHub Actions** | CI/CD, YAML, secrets, matrix builds | The actual pipeline that builds and deploys this portfolio on every push to `main`. |

---

## Repo layout

```
tech_cv/
├── showcase/              Nuxt 3 site — landing page + demo catalog
│   ├── pages/index.vue    Demo cards, filters, hero
│   ├── public/demos/      Built demo output (generated)
│   ├── server/            API routes (proxy to node-api etc.)
│   └── build-demos.sh     Builds every demo into public/demos/
├── demos/
│   ├── vue/               Kanban board (Vue 3 + Pinia)
│   ├── react/             Analytics dashboard
│   ├── svelte/            Reactive task board
│   ├── typescript/        TS patterns walkthrough
│   ├── scss/              SCSS playground
│   ├── vitest/            Test-runner UI
│   ├── node-api/          Express REST API (backbone)
│   ├── graphql-api/       graphql-yoga server
│   ├── graphql/           GraphQL query-builder UI
│   ├── auth/              JWT + OAuth2 walkthrough
│   ├── mysql/             SQL demo (SQLite-backed)
│   ├── mongodb/           NoSQL demo
│   ├── ai/                Claude streaming chat
│   ├── docker/            Dockerfiles + Compose
│   └── github-actions/    CI/CD pipeline demo
├── build.sh               Build everything (demos + showcase)
├── deploy-all.sh          Deploy pipeline
└── package.json           npm workspaces root
```

---

## Getting started

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

This installs dependencies for the root and every workspace (Nuxt showcase + all demos).

### Run the showcase site only

```bash
npm run showcase
```

Opens the landing page on <http://localhost:3000>.

### Run everything in parallel

```bash
npm run dev
```

Boots the showcase site plus every backing service (Vue, React, Node API, AI, TS, GraphQL, auth, MySQL, Docker) on ports `3000`–`3009`, each in its own color-coded log stream.

### Individual demos

```bash
npm run vue       # Vue 3 Kanban       → :3001
npm run react     # React dashboard    → :3002
npm run api       # Node REST API      → :3003
npm run ai        # Claude chat        → :3004
npm run ts        # TS patterns        → :3005
npm run gql-api   # GraphQL server     → :3006 (used by gql UI)
npm run gql       # GraphQL UI         → :3006
npm run auth      # JWT/OAuth2         → :3007
npm run mysql     # SQL demo           → :3008
npm run docker    # Docker demo        → :3009
```

Ports match `showcase/nuxt.config.ts` runtime config — the showcase proxies to these during local dev.

---

## Build & deploy

Everything is one command:

```bash
./build.sh
```

Under the hood:

1. `showcase/build-demos.sh` builds each demo and copies the output into `showcase/public/demos/<name>/`.
2. `nuxt build` compiles the showcase site.

Deployment target is Vercel (`showcase/vercel.json`). The GitHub Actions demo (`demos/github-actions/`) documents the actual pipeline that runs on every push to `main`.

---

## Environment

The **AI demo** requires an Anthropic API key. Set it before running:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

The key is only ever read server-side — the Vue client hits a Node proxy which forwards to the Claude API.

---

## Tech stack summary

- **Language:** TypeScript throughout (strict mode)
- **Framework:** Nuxt 3 (showcase), Vue 3, React, Svelte 4
- **Backend:** Node.js + Express, graphql-yoga
- **Data:** SQLite (via `better-sqlite3`), MongoDB (Mongoose)
- **Styling:** SCSS, CSS custom properties
- **AI:** Anthropic Claude API (SSE streaming)
- **Testing:** Vitest + `@vue/test-utils`
- **DevOps:** Docker + Compose, GitHub Actions, Vercel
- **Tooling:** Vite, npm workspaces, concurrently

---

## Contact

- **Email:** [jl.7804@gmail.com](mailto:jl.7804@gmail.com)
- **Site:** [jonas.dev](https://jonas.dev)
