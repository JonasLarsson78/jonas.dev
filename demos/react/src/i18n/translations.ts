export type Locale = 'en' | 'sv'

export type MetricKey = 'revenue' | 'users' | 'conversions' | 'rate'
export type MonthKey =
  | 'day-mon' | 'day-tue' | 'day-wed' | 'day-thu' | 'day-fri' | 'day-sat' | 'day-sun'
  | 'week-1' | 'week-2' | 'week-3' | 'week-4'
  | 'month-jan' | 'month-feb' | 'month-mar'

const en = {
  topbar: {
    back: 'Portfolio',
  },
  header: {
    title: 'Analytics Dashboard',
    subtitle: 'Built with React 18 Hooks, TypeScript, and custom data hooks',
  },
  ranges: {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
  },
  metrics: {
    revenue: 'Total Revenue',
    users: 'Active Users',
    conversions: 'Conversions',
    rate: 'Conv. Rate',
  } as Record<MetricKey, string>,
  charts: {
    revenue: 'Revenue (kr)',
    users: 'Active Users',
  },
  metricCard: {
    vsPrev: 'vs prev.',
  },
  months: {
    'day-mon': 'Mon', 'day-tue': 'Tue', 'day-wed': 'Wed', 'day-thu': 'Thu', 'day-fri': 'Fri', 'day-sat': 'Sat', 'day-sun': 'Sun',
    'week-1': 'Week 1', 'week-2': 'Week 2', 'week-3': 'Week 3', 'week-4': 'Week 4',
    'month-jan': 'Jan', 'month-feb': 'Feb', 'month-mar': 'Mar',
  } as Record<MonthKey, string>,
  callout: {
    title: 'What this demo shows',
    items: [
      { icon: '🪝', html: '<strong>useState + useEffect</strong> — range selection triggers data reload' },
      { icon: '🧮', html: '<strong>useMemo</strong> — metrics recalculate only when data changes' },
      { icon: '🎣', html: '<strong>useCallback</strong> — stable load fn reference for useEffect deps' },
      { icon: '🔷', html: '<strong>TypeScript</strong> — typed hooks, props, and generics throughout' },
    ],
  },
}

const sv: typeof en = {
  topbar: {
    back: 'Portfölj',
  },
  header: {
    title: 'Analytics-dashboard',
    subtitle: 'Byggd med React 18 Hooks, TypeScript och egna data-hooks',
  },
  ranges: {
    '7d': 'Senaste 7 dagarna',
    '30d': 'Senaste 30 dagarna',
    '90d': 'Senaste 90 dagarna',
  },
  metrics: {
    revenue: 'Total omsättning',
    users: 'Aktiva användare',
    conversions: 'Konverteringar',
    rate: 'Konv.grad',
  },
  charts: {
    revenue: 'Omsättning (kr)',
    users: 'Aktiva användare',
  },
  metricCard: {
    vsPrev: 'vs föreg.',
  },
  months: {
    'day-mon': 'Mån', 'day-tue': 'Tis', 'day-wed': 'Ons', 'day-thu': 'Tor', 'day-fri': 'Fre', 'day-sat': 'Lör', 'day-sun': 'Sön',
    'week-1': 'Vecka 1', 'week-2': 'Vecka 2', 'week-3': 'Vecka 3', 'week-4': 'Vecka 4',
    'month-jan': 'Jan', 'month-feb': 'Feb', 'month-mar': 'Mar',
  },
  callout: {
    title: 'Vad demot visar',
    items: [
      { icon: '🪝', html: '<strong>useState + useEffect</strong> — val av intervall triggar omladdning av data' },
      { icon: '🧮', html: '<strong>useMemo</strong> — metrics räknas om bara när data ändras' },
      { icon: '🎣', html: '<strong>useCallback</strong> — stabil load-referens för useEffect-deps' },
      { icon: '🔷', html: '<strong>TypeScript</strong> — typade hooks, props och generics genomgående' },
    ],
  },
}

export const translations: Record<Locale, typeof en> = { en, sv }
