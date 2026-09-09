import { useMemo } from 'react'
import type { DataPoint } from '../types'
import { useLocale } from '../hooks/useLocale'

interface Props {
  data: DataPoint[]
  dataKey: Exclude<keyof DataPoint, 'monthKey'>
  color: string
  label: string
}

export function BarChart({ data, dataKey, color, label }: Props) {
  const { t } = useLocale()
  const max = useMemo(
    () => Math.max(...data.map(d => d[dataKey] as number), 1),
    [data, dataKey]
  )

  return (
    <div className="chart-wrap">
      <div className="chart-label">{label}</div>
      <div className="chart-bars">
        {data.map((point, i) => {
          const height = ((point[dataKey] as number) / max) * 100
          return (
            <div key={i} className="bar-col">
              <div className="bar-tooltip">
                {(point[dataKey] as number).toLocaleString()}
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(180deg, ${color} 0%, ${color}66 100%)`,
                    animationDelay: `${i * 60}ms`,
                  }}
                />
              </div>
              <div className="bar-month">{t.months[point.monthKey]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
