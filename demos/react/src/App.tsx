import { useState } from 'react'
import { MetricCard } from './components/MetricCard'
import { BarChart } from './components/BarChart'
import { useMetrics } from './hooks/useMetrics'
import type { TimeRange } from './types'
import './app.css'

const ranges: { value: TimeRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

export default function App() {
  const [range, setRange] = useState<TimeRange>('30d')
  const { data, metrics, loading } = useMetrics(range)

  return (
    <div className="app">
      {/* Topbar */}
      <div className="topbar">
        <a href="/" className="back-link">← Portfolio</a>
        <div className="topbar-center">
          <span className="tech-badge react">React 18</span>
          <span className="tech-badge ts">TypeScript</span>
          <span className="tech-badge hooks">Custom Hooks</span>
        </div>
        <div style={{ width: 100 }} />
      </div>

      <div className="container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Analytics Dashboard</h1>
            <p className="dash-subtitle">
              Built with React 18 Hooks, TypeScript, and custom data hooks
            </p>
          </div>
          <div className="range-tabs">
            {ranges.map(r => (
              <button
                key={r.value}
                className={`range-tab ${range === r.value ? 'active' : ''}`}
                onClick={() => setRange(r.value)}
              >
                {r.label}
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
              : <BarChart data={data} dataKey="revenue" color="#6366f1" label="Revenue (kr)" />
            }
          </div>
          <div className="chart-card">
            {loading
              ? <div className="skeleton" style={{ height: 200 }} />
              : <BarChart data={data} dataKey="users" color="#22c55e" label="Active Users" />
            }
          </div>
        </div>

        {/* Code callout */}
        <div className="code-callout">
          <div className="code-callout-title">What this demo shows</div>
          <div className="code-callout-items">
            <div className="code-item">
              <span>🪝</span>
              <span><strong>useState + useEffect</strong> — range selection triggers data reload</span>
            </div>
            <div className="code-item">
              <span>🧮</span>
              <span><strong>useMemo</strong> — metrics recalculate only when data changes</span>
            </div>
            <div className="code-item">
              <span>🎣</span>
              <span><strong>useCallback</strong> — stable load fn reference for useEffect deps</span>
            </div>
            <div className="code-item">
              <span>🔷</span>
              <span><strong>TypeScript</strong> — typed hooks, props, and generics throughout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
