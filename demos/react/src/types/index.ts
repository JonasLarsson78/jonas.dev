export interface Metric {
  id: string
  label: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  color: string
}

export interface DataPoint {
  month: string
  revenue: number
  users: number
  conversions: number
}

export type TimeRange = '7d' | '30d' | '90d'
