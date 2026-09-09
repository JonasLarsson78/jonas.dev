import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Metric, DataPoint, TimeRange } from '../types'

const allData: Record<TimeRange, DataPoint[]> = {
  '7d': [
    { monthKey: 'day-mon', revenue: 4200, users: 340, conversions: 28 },
    { monthKey: 'day-tue', revenue: 3800, users: 290, conversions: 22 },
    { monthKey: 'day-wed', revenue: 5100, users: 410, conversions: 35 },
    { monthKey: 'day-thu', revenue: 4700, users: 380, conversions: 31 },
    { monthKey: 'day-fri', revenue: 6200, users: 520, conversions: 44 },
    { monthKey: 'day-sat', revenue: 3100, users: 240, conversions: 18 },
    { monthKey: 'day-sun', revenue: 2800, users: 210, conversions: 15 },
  ],
  '30d': [
    { monthKey: 'week-1', revenue: 28400, users: 2100, conversions: 178 },
    { monthKey: 'week-2', revenue: 31200, users: 2400, conversions: 201 },
    { monthKey: 'week-3', revenue: 29800, users: 2250, conversions: 189 },
    { monthKey: 'week-4', revenue: 34500, users: 2700, conversions: 228 },
  ],
  '90d': [
    { monthKey: 'month-jan', revenue: 112000, users: 8400, conversions: 720 },
    { monthKey: 'month-feb', revenue: 128000, users: 9600, conversions: 820 },
    { monthKey: 'month-mar', revenue: 141000, users: 10800, conversions: 910 },
  ],
}

export function useMetrics(range: TimeRange) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DataPoint[]>([])

  const load = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setData(allData[range])
      setLoading(false)
    }, 400)
  }, [range])

  useEffect(() => {
    load()
  }, [load])

  const metrics = useMemo<Metric[]>(() => {
    if (!data.length) return []

    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
    const totalUsers = data.reduce((s, d) => s + d.users, 0)
    const totalConversions = data.reduce((s, d) => s + d.conversions, 0)
    const convRate = totalUsers > 0 ? (totalConversions / totalUsers) * 100 : 0

    return [
      { id: 'revenue',     value: totalRevenue,                     unit: 'kr', change: 12.4, trend: 'up',   color: '#6366f1' },
      { id: 'users',       value: totalUsers,                       unit: '',   change: 8.1,  trend: 'up',   color: '#22c55e' },
      { id: 'conversions', value: totalConversions,                 unit: '',   change: -2.3, trend: 'down', color: '#f59e0b' },
      { id: 'rate',        value: parseFloat(convRate.toFixed(1)),  unit: '%',  change: 0.4,  trend: 'up',   color: '#ec4899' },
    ]
  }, [data])

  return { data, metrics, loading }
}
