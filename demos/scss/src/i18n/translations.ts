export type Locale = 'en' | 'sv'
export type Tab = 'variables' | 'nesting' | 'mixins' | 'layout'

interface Color { name: string; value: string; desc: string }

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'SCSS Showcase',
    subtitle: 'Variables, nesting, mixins, and interactive Flexbox/Grid builders. All styles in this portfolio are written with SCSS principles.',
  },
  tabs: {
    variables: 'Variables',
    nesting: 'Nesting',
    mixins: 'Mixins & Functions',
    layout: 'Flexbox & Grid',
  } as Record<Tab, string>,
  labels: {
    variablesFile: '_variables.scss',
    palette: 'Color palette — live',
    spacingScale: 'Spacing scale',
    scssNesting: 'SCSS nesting',
    compiledOutput: 'Compiled output — live examples',
    bemNaming: 'BEM naming with SCSS',
    mixinsFunctions: 'Mixins & functions',
    generatedUtilities: 'Generated utility classes (from @each)',
    brandAlpha: 'brand-alpha() function',
    flexboxPlayground: 'Flexbox playground',
    gridPlayground: 'CSS Grid playground',
    columns: (n: number) => `columns: ${n}`,
  },
  demoCards: {
    regularTitle: 'Regular card',
    regularBody: 'Hover to see :hover state',
    featuredTitle: 'Featured card',
    featuredBody: 'Modified with BEM modifier class',
  },
  colors: [
    { name: '$color-primary', value: '#6366f1', desc: 'Indigo — CTAs, links' },
    { name: '$color-success', value: '#22c55e', desc: 'Green — positive states' },
    { name: '$color-warning', value: '#f59e0b', desc: 'Amber — alerts, badges' },
    { name: '$color-danger',  value: '#ef4444', desc: 'Red — errors, destructive' },
    { name: '$color-bg',      value: '#060610', desc: 'Page background' },
    { name: '$color-surface', value: '#0d0d1a', desc: 'Card background' },
  ] as Color[],
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'SCSS-showcase',
    subtitle: 'Variabler, nesting, mixins och interaktiva Flexbox/Grid-byggare. Alla stilar i portföljen är skrivna med SCSS-principer.',
  },
  tabs: {
    variables: 'Variabler',
    nesting: 'Nesting',
    mixins: 'Mixins & funktioner',
    layout: 'Flexbox & Grid',
  },
  labels: {
    variablesFile: '_variables.scss',
    palette: 'Färgpalett — live',
    spacingScale: 'Spacing-skala',
    scssNesting: 'SCSS-nesting',
    compiledOutput: 'Kompilerad output — live-exempel',
    bemNaming: 'BEM-namngivning med SCSS',
    mixinsFunctions: 'Mixins & funktioner',
    generatedUtilities: 'Genererade utility-klasser (från @each)',
    brandAlpha: 'brand-alpha()-funktion',
    flexboxPlayground: 'Flexbox-playground',
    gridPlayground: 'CSS Grid-playground',
    columns: (n: number) => `kolumner: ${n}`,
  },
  demoCards: {
    regularTitle: 'Vanligt kort',
    regularBody: 'Hovra för att se :hover-state',
    featuredTitle: 'Utvalt kort',
    featuredBody: 'Modifierat med BEM-modifier-klass',
  },
  colors: [
    { name: '$color-primary', value: '#6366f1', desc: 'Indigo — CTA:er, länkar' },
    { name: '$color-success', value: '#22c55e', desc: 'Grön — positiva tillstånd' },
    { name: '$color-warning', value: '#f59e0b', desc: 'Bärnsten — varningar, badges' },
    { name: '$color-danger',  value: '#ef4444', desc: 'Röd — fel, destruktivt' },
    { name: '$color-bg',      value: '#060610', desc: 'Sidbakgrund' },
    { name: '$color-surface', value: '#0d0d1a', desc: 'Kortbakgrund' },
  ],
}

export const translations: Record<Locale, typeof en> = { en, sv }
