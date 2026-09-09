export type Locale = 'en' | 'sv'
export type Tab = 'workflow' | 'steps' | 'patterns'

interface JobItem { label: string; desc: string }
interface Job { name: string; icon: string; color: string; items: JobItem[] }
interface Pattern { title: string; code: string; desc: string }

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'GitHub Actions',
    subtitle: 'The CI/CD pipeline that builds and deploys this portfolio. Every push to main runs type checks, builds all demos, then deploys to Vercel.',
  },
  tabs: {
    workflow: 'Workflow YAML',
    steps: 'Pipeline steps',
    patterns: 'Common patterns',
  } as Record<Tab, string>,
  workflow: {
    codeLabel: '.github/workflows/ci.yml',
  },
  arrows: { onSuccess: '↓ on success' },
  jobs: [
    {
      name: 'Trigger', icon: '⚡', color: '#818cf8',
      items: [
        { label: 'push to main', desc: 'Every commit to main triggers the full pipeline' },
        { label: 'pull_request', desc: 'PRs run tests before merge is allowed' },
      ],
    },
    {
      name: 'Test job', icon: '🧪', color: '#22c55e',
      items: [
        { label: 'actions/checkout@v4', desc: 'Clone the repository into the runner' },
        { label: 'setup-node@v4 + cache', desc: 'Node 22 with npm cache — faster reinstalls' },
        { label: 'npm ci', desc: 'Clean install from package-lock.json (reproducible)' },
        { label: 'type-check', desc: 'Run vue-tsc / tsc across all workspaces' },
        { label: 'build-demos.sh', desc: 'Build all 9 Vite demos into showcase/public/' },
      ],
    },
    {
      name: 'Deploy job', icon: '🚀', color: '#f59e0b',
      items: [
        { label: 'needs: test', desc: 'Deploy only runs if test job succeeds' },
        { label: 'if: main branch', desc: 'PRs run tests but never deploy to production' },
        { label: 'vercel-action', desc: 'Triggers a Vercel production deployment via API' },
        { label: 'secrets.*', desc: 'Credentials stored in GitHub Secrets — never in code' },
      ],
    },
  ] as Job[],
  patterns: [
    { title: 'Matrix builds',        code: `strategy:\n  matrix:\n    node: [20, 22]\n    os: [ubuntu-latest, windows-latest]`, desc: 'Run tests across multiple Node versions and OS combinations in parallel.' },
    { title: 'Caching',              code: `- uses: actions/cache@v4\n  with:\n    path: ~/.npm\n    key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}`, desc: 'Cache dependencies between runs — saves 30-60s on most projects.' },
    { title: 'Environment secrets',  code: `env:\n  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}\n  DATABASE_URL: \${{ secrets.DATABASE_URL }}`, desc: 'Secrets are injected at runtime, never stored in the repo.' },
    { title: 'Conditional steps',    code: `- name: Deploy\n  if: github.ref == 'refs/heads/main'\n    && github.event_name == 'push'`, desc: 'Gate destructive steps behind branch and event conditions.' },
  ] as Pattern[],
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'GitHub Actions',
    subtitle: 'CI/CD-pipelinen som bygger och deployar den här portföljen. Varje push till main kör type checks, bygger alla demos och deployar till Vercel.',
  },
  tabs: {
    workflow: 'Workflow-YAML',
    steps: 'Pipeline-steg',
    patterns: 'Vanliga mönster',
  },
  workflow: {
    codeLabel: '.github/workflows/ci.yml',
  },
  arrows: { onSuccess: '↓ vid framgång' },
  jobs: [
    {
      name: 'Trigger', icon: '⚡', color: '#818cf8',
      items: [
        { label: 'push to main', desc: 'Varje commit till main triggar hela pipelinen' },
        { label: 'pull_request', desc: 'PR:er kör tester innan merge tillåts' },
      ],
    },
    {
      name: 'Test-job', icon: '🧪', color: '#22c55e',
      items: [
        { label: 'actions/checkout@v4', desc: 'Klona repot in i runnern' },
        { label: 'setup-node@v4 + cache', desc: 'Node 22 med npm-cache — snabbare ominstallationer' },
        { label: 'npm ci', desc: 'Ren install från package-lock.json (reproducerbar)' },
        { label: 'type-check', desc: 'Kör vue-tsc / tsc över alla workspaces' },
        { label: 'build-demos.sh', desc: 'Bygg alla 9 Vite-demos till showcase/public/' },
      ],
    },
    {
      name: 'Deploy-job', icon: '🚀', color: '#f59e0b',
      items: [
        { label: 'needs: test', desc: 'Deploy körs bara om test-jobbet lyckas' },
        { label: 'if: main-branch', desc: 'PR:er kör tester men deployar aldrig till produktion' },
        { label: 'vercel-action', desc: 'Triggar en Vercel-produktionsdeploy via API' },
        { label: 'secrets.*', desc: 'Credentials lagras i GitHub Secrets — aldrig i koden' },
      ],
    },
  ],
  patterns: [
    { title: 'Matrix-builds',       code: `strategy:\n  matrix:\n    node: [20, 22]\n    os: [ubuntu-latest, windows-latest]`, desc: 'Kör tester över flera Node-versioner och OS-kombinationer parallellt.' },
    { title: 'Caching',              code: `- uses: actions/cache@v4\n  with:\n    path: ~/.npm\n    key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}`, desc: 'Cacha beroenden mellan körningar — sparar 30-60s i de flesta projekt.' },
    { title: 'Miljö-secrets',        code: `env:\n  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}\n  DATABASE_URL: \${{ secrets.DATABASE_URL }}`, desc: 'Secrets injiceras vid runtime, aldrig lagrade i repot.' },
    { title: 'Villkorliga steg',     code: `- name: Deploy\n  if: github.ref == 'refs/heads/main'\n    && github.event_name == 'push'`, desc: 'Grinda destruktiva steg bakom branch- och event-villkor.' },
  ],
}

export const translations: Record<Locale, typeof en> = { en, sv }
