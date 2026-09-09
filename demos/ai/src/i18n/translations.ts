export type Locale = 'en' | 'sv'

const en = {
  topbar: {
    back: 'Portfolio',
    mockBadge: 'Mock mode',
  },
  sidebar: {
    architecture: 'Architecture',
    tryAsking: 'Try asking',
    status: 'Status',
    mockActive: 'Mock mode active',
    statusNote: 'Set <code>ANTHROPIC_API_KEY</code> in Node API environment to enable real Claude responses.',
  },
  chat: {
    title: 'AI Chat',
    subtitle: 'Claude API · Streaming · Secure proxy pattern',
    inputPlaceholder: 'Ask about Vue, React, TypeScript, Node.js, or this portfolio...',
    inputHint: 'Enter to send · Shift+Enter for new line',
    userRole: 'You',
    assistantRole: 'Claude',
  },
  suggestions: [
    'How does the streaming work?',
    'Tell me about Vue 3 vs React',
    'What TypeScript patterns do you use?',
    'How is the API key handled securely?',
  ],
  errors: {
    apiUnreachable: '_Could not connect to the API. Make sure the Node.js server is running on port 3003._',
    apiError: (err: string) => `\n\n_Error from API: ${err}_`,
  },
  intro: `Hi! I'm a demonstration of the **Claude API** integration in Jonas's portfolio.

I'm currently running in **mock mode** (no API key configured), but the streaming pattern is identical to the real thing — Server-Sent Events from a Node.js proxy to Anthropic's API.

Try asking me about: **Vue 3**, **React**, **TypeScript**, or this portfolio's architecture.`,
}

const sv: typeof en = {
  topbar: {
    back: 'Portfölj',
    mockBadge: 'Mock-läge',
  },
  sidebar: {
    architecture: 'Arkitektur',
    tryAsking: 'Prova att fråga',
    status: 'Status',
    mockActive: 'Mock-läge aktivt',
    statusNote: 'Sätt <code>ANTHROPIC_API_KEY</code> i Node API:ts miljö för att aktivera riktiga Claude-svar.',
  },
  chat: {
    title: 'AI-chatt',
    subtitle: 'Claude API · Streaming · Säkert proxy-mönster',
    inputPlaceholder: 'Fråga om Vue, React, TypeScript, Node.js eller den här portföljen...',
    inputHint: 'Enter för att skicka · Shift+Enter för ny rad',
    userRole: 'Du',
    assistantRole: 'Claude',
  },
  suggestions: [
    'Hur funkar streamingen?',
    'Berätta om Vue 3 vs React',
    'Vilka TypeScript-mönster använder du?',
    'Hur hanteras API-nyckeln säkert?',
  ],
  errors: {
    apiUnreachable: '_Kunde inte ansluta till API:t. Se till att Node.js-servern körs på port 3003._',
    apiError: (err: string) => `\n\n_Fel från API: ${err}_`,
  },
  intro: `Hej! Jag är en demonstration av **Claude API**-integrationen i Jonas portfölj.

Jag kör just nu i **mock-läge** (ingen API-nyckel konfigurerad), men streaming-mönstret är identiskt med det riktiga — Server-Sent Events från en Node.js-proxy till Anthropics API.

Prova att fråga mig om: **Vue 3**, **React**, **TypeScript** eller den här portföljens arkitektur.`,
}

export const translations: Record<Locale, typeof en> = { en, sv }
