import { useState } from 'react'
import { MetricCard } from './components/MetricCard'
import { BarChart } from './components/BarChart'
import { LanguageToggle } from './components/LanguageToggle'
import { useMetrics } from './hooks/useMetrics'
import { useLocale } from './hooks/useLocale'
import type { TimeRange } from './types'
import './app.css'

const rangeValues: TimeRange[] = ['7d', '30d', '90d']

export default function App() {
  const [range, setRange] = useState<TimeRange>('30d')
  const { data, metrics, loading } = useMetrics(range)
  const { t } = useLocale()

  return (
    <div className="app">
      {/* Topbar */}
      <div className="topbar">
        <a href="/" className="back-link">← {t.topbar.back}</a>
        <div className="topbar-center">
          <span className="tech-badge react">React 18</span>
          <span className="tech-badge ts">TypeScript</span>
          <span className="tech-badge hooks">Custom Hooks</span>
        </div>
        <div className="topbar-right">
          <LanguageToggle />
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">{t.header.title}</h1>
            <p className="dash-subtitle">{t.header.subtitle}</p>
          </div>
          <div className="range-tabs">
            {rangeValues.map(r => (
              <button
                key={r}
                className={`range-tab ${range === r ? 'active' : ''}`}
                onClick={() => setRange(r)}
              >
                {t.ranges[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className={`metrics-grid ${loading ? 'loading' : ''}`}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="metric-card skeleton" />
              ))
            : metrics.map(m => <MetricCard key={m.id} metric={m} />)
          }
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            {loading
              ? <div className="skeleton" style={{ height: 200 }} />
              : <BarChart data={data} dataKey="revenue" color="#6366f1" label={t.charts.revenue} />
            }
          </div>
          <div className="chart-card">
            {loading
              ? <div className="skeleton" style={{ height: 200 }} />
              : <BarChart data={data} dataKey="users" color="#22c55e" label={t.charts.users} />
            }
          </div>
        </div>

        {/* Code callout */}
        <div className="code-callout">
          <div className="code-callout-title">{t.callout.title}</div>
          <div className="code-callout-items">
            {t.callout.items.map((item, i) => (
              <div key={i} className="code-item">
                <span>{item.icon}</span>
                <span dangerouslySetInnerHTML={{ __html: item.html }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
