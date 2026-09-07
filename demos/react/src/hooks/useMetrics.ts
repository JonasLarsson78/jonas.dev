import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Metric, DataPoint, TimeRange } from '../types'

const allData: Record<TimeRange, DataPoint[]> = {
  '7d': [
    { month: 'Mon', revenue: 4200, users: 340, conversions: 28 },
    { month: 'Tue', revenue: 3800, users: 290, conversions: 22 },
    { month: 'Wed', revenue: 5100, users: 410, conversions: 35 },
    { month: 'Thu', revenue: 4700, users: 380, conversions: 31 },
    { month: 'Fri', revenue: 6200, users: 520, conversions: 44 },
    { month: 'Sat', revenue: 3100, users: 240, conversions: 18 },
    { month: 'Sun', revenue: 2800, users: 210, conversions: 15 },
  ],
  '30d': [
    { month: 'Week 1', revenue: 28400, users: 2100, conversions: 178 },
    { month: 'Week 2', revenue: 31200, users: 2400, conversions: 201 },
    { month: 'Week 3', revenue: 29800, users: 2250, conversions: 189 },
    { month: 'Week 4', revenue: 34500, users: 2700, conversions: 228 },
  ],
  '90d': [
    { month: 'Jan', revenue: 112000, users: 8400, conversions: 720 },
    { month: 'Feb', revenue: 128000, users: 9600, conversions: 820 },
    { month: 'Mar', revenue: 141000, users: 10800, conversions: 910 },
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
      {
        id: 'revenue',
        label: 'Total Revenue',
        value: totalRevenue,
        unit: 'kr',
        change: 12.4,
        trend: 'up',
        color: '#6366f1',
      },
      {
        id: 'users',
        label: 'Active Users',
        value: totalUsers,
        unit: '',
        change: 8.1,
        trend: 'up',
        color: '#22c55e',
      },
      {
        id: 'conversions',
        label: 'Conversions',
        value: totalConversions,
        unit: '',
        change: -2.3,
        trend: 'down',
        color: '#f59e0b',
      },
      {
        id: 'rate',
        label: 'Conv. Rate',
        value: parseFloat(convRate.toFixed(1)),
        unit: '%',
        change: 0.4,
        trend: 'up',
        color: '#ec4899',
      },
    ]
  }, [data])

  return { data, metrics, loading }
}
