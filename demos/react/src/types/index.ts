import type { MetricKey, MonthKey } from '../i18n/translations'

export interface Metric {
  id: MetricKey
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  color: string
}

export interface DataPoint {
  monthKey: MonthKey
  revenue: number
  users: number
  conversions: number
}

export type TimeRange = '7d' | '30d' | '90d'
