export type Locale = 'en' | 'sv'
export type Tab = 'compose' | 'dockerfiles' | 'commands'

interface CmdItem { cmd: string; desc: string }
interface CmdGroup { group: string; items: CmdItem[] }

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'Docker',
    subtitle: 'Production-ready Dockerfiles for every service in this portfolio, orchestrated with Docker Compose. Multi-stage builds keep final images small.',
  },
  tabs: {
    compose: 'docker-compose.yml',
    dockerfiles: 'Dockerfiles',
    commands: 'Common commands',
  } as Record<Tab, string>,
  compose: {
    codeLabel: 'docker-compose.yml — full stack in one command',
    tip1Html: '💡 <code>depends_on</code> ensures api starts before showcase',
    tip2Html: '💡 <code>healthcheck</code> makes Compose wait until the service is actually ready',
    tip3Html: '💡 <code>ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}</code> — secret injected from host env, never in the image',
  },
  dockerfiles: {
    tip1Html: '💡 <strong>Multi-stage build</strong> — <code>builder</code> stage has dev dependencies; <code>runner</code> stage only has production output. Final image is ~10× smaller.',
    tip2Html: '💡 Vue/React builds produce static files → served by <strong>nginx:alpine</strong> (&lt;10MB image vs 300MB+ Node image)',
  },
  commands: [
    { group: 'Build & run', items: [
      { cmd: 'docker compose up --build', desc: 'Build and start all services' },
      { cmd: 'docker compose up -d', desc: 'Start in detached mode' },
      { cmd: 'docker compose down', desc: 'Stop and remove containers' },
      { cmd: 'docker compose logs -f api', desc: 'Stream logs from api service' },
    ]},
    { group: 'Individual services', items: [
      { cmd: 'docker compose up showcase', desc: 'Start only the portfolio page' },
      { cmd: 'docker compose up api graphql-api', desc: 'Start both API services' },
      { cmd: 'docker compose restart api', desc: 'Restart a single service' },
    ]},
    { group: 'Inspect & debug', items: [
      { cmd: 'docker compose ps', desc: 'List running containers and ports' },
      { cmd: 'docker compose exec api sh', desc: 'Open shell in api container' },
      { cmd: 'docker stats', desc: 'Real-time resource usage per container' },
      { cmd: 'docker compose images', desc: 'List built images and sizes' },
    ]},
    { group: 'Cleanup', items: [
      { cmd: 'docker compose down --volumes', desc: 'Remove containers + volumes' },
      { cmd: 'docker system prune', desc: 'Remove all unused data' },
      { cmd: 'docker image prune', desc: 'Remove dangling images only' },
    ]},
  ] as CmdGroup[],
  services: [
    { label: 'showcase',    port: 3000, color: '#00dc82', note: 'Nuxt 3 SSR' },
    { label: 'api',         port: 3003, color: '#5cb85c', note: 'Express + SQLite' },
    { label: 'graphql-api', port: 4001, color: '#e10098', note: 'graphql-yoga' },
    { label: 'vue-demo',    port: 3001, color: '#42b883', note: 'nginx static' },
    { label: 'react-demo',  port: 3002, color: '#61dafb', note: 'nginx static' },
    { label: 'auth-demo',   port: 3007, color: '#eab308', note: 'nginx static' },
  ],
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'Docker',
    subtitle: 'Production-ready Dockerfiles för varje tjänst i portföljen, orkestrerade med Docker Compose. Multi-stage builds håller slutgiltiga images små.',
  },
  tabs: {
    compose: 'docker-compose.yml',
    dockerfiles: 'Dockerfiles',
    commands: 'Vanliga kommandon',
  },
  compose: {
    codeLabel: 'docker-compose.yml — hela stacken i ett kommando',
    tip1Html: '💡 <code>depends_on</code> säkerställer att api startar innan showcase',
    tip2Html: '💡 <code>healthcheck</code> får Compose att vänta tills tjänsten faktiskt är redo',
    tip3Html: '💡 <code>ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}</code> — hemlighet injiceras från host-miljön, aldrig i imagen',
  },
  dockerfiles: {
    tip1Html: '💡 <strong>Multi-stage build</strong> — <code>builder</code>-steget har dev-beroenden; <code>runner</code>-steget har bara produktions-output. Slutgiltiga imagen är ~10× mindre.',
    tip2Html: '💡 Vue/React-builds producerar statiska filer → servas av <strong>nginx:alpine</strong> (&lt;10MB image vs 300MB+ Node-image)',
  },
  commands: [
    { group: 'Bygga & köra', items: [
      { cmd: 'docker compose up --build', desc: 'Bygg och starta alla tjänster' },
      { cmd: 'docker compose up -d', desc: 'Starta i detached-läge' },
      { cmd: 'docker compose down', desc: 'Stoppa och ta bort containrar' },
      { cmd: 'docker compose logs -f api', desc: 'Streama loggar från api-tjänsten' },
    ]},
    { group: 'Enskilda tjänster', items: [
      { cmd: 'docker compose up showcase', desc: 'Starta bara portföljsidan' },
      { cmd: 'docker compose up api graphql-api', desc: 'Starta båda API-tjänsterna' },
      { cmd: 'docker compose restart api', desc: 'Starta om en enskild tjänst' },
    ]},
    { group: 'Inspektera & debugga', items: [
      { cmd: 'docker compose ps', desc: 'Lista körande containrar och portar' },
      { cmd: 'docker compose exec api sh', desc: 'Öppna shell i api-containern' },
      { cmd: 'docker stats', desc: 'Realtidsanvändning per container' },
      { cmd: 'docker compose images', desc: 'Lista byggda images och storlekar' },
    ]},
    { group: 'Rensa', items: [
      { cmd: 'docker compose down --volumes', desc: 'Ta bort containrar + volymer' },
      { cmd: 'docker system prune', desc: 'Ta bort all oanvänd data' },
      { cmd: 'docker image prune', desc: 'Ta bort bara hängande images' },
    ]},
  ],
  services: [
    { label: 'showcase',    port: 3000, color: '#00dc82', note: 'Nuxt 3 SSR' },
    { label: 'api',         port: 3003, color: '#5cb85c', note: 'Express + SQLite' },
    { label: 'graphql-api', port: 4001, color: '#e10098', note: 'graphql-yoga' },
    { label: 'vue-demo',    port: 3001, color: '#42b883', note: 'nginx statisk' },
    { label: 'react-demo',  port: 3002, color: '#61dafb', note: 'nginx statisk' },
    { label: 'auth-demo',   port: 3007, color: '#eab308', note: 'nginx statisk' },
  ],
}

export const translations: Record<Locale, typeof en> = { en, sv }
