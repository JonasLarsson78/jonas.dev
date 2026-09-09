import type { Metric } from '../types'
import { useLocale } from '../hooks/useLocale'

interface Props {
  metric: Metric
}

function formatValue(value: number, unit: string): string {
  if (unit === 'kr') {
    return value >= 1000
      ? `${(value / 1000).toFixed(0)}k ${unit}`
      : `${value} ${unit}`
  }
  if (unit === '%') return `${value}%`
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
}

export function MetricCard({ metric }: Props) {
  const { t } = useLocale()
  const isUp = metric.trend === 'up'
  const trendColor = isUp ? '#22c55e' : '#ef4444'
  const trendSymbol = isUp ? '↑' : '↓'

  return (
    <div className="metric-card" style={{ '--accent': metric.color } as React.CSSProperties}>
      <div className="metric-label">{t.metrics[metric.id]}</div>
      <div className="metric-value" style={{ color: metric.color }}>
        {formatValue(metric.value, metric.unit)}
      </div>
      <div className="metric-change" style={{ color: trendColor }}>
        {trendSymbol} {Math.abs(metric.change)}% {t.metricCard.vsPrev}
      </div>
    </div>
  )
}
