<script lang="ts">
  import { writable, derived } from 'svelte/store'
  import { fade, fly, slide } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  const portfolioUrl = '/'

  // ── Svelte store ────────────────────────────────────────────────────────────
  interface Task { id: number; title: string; done: boolean; priority: 'low' | 'medium' | 'high' }

  const tasks = writable<Task[]>([
    { id: 1, title: 'Learn Svelte stores',    done: true,  priority: 'high' },
    { id: 2, title: 'Build reactive UI',       done: true,  priority: 'high' },
    { id: 3, title: 'Use Svelte transitions',  done: false, priority: 'medium' },
    { id: 4, title: 'Animate with flip()',     done: false, priority: 'medium' },
    { id: 5, title: 'Deploy with Vite',        done: false, priority: 'low' },
  ])

  // Derived store — reaktiv beräkning
  const stats = derived(tasks, $tasks => ({
    total:    $tasks.length,
    done:     $tasks.filter(t => t.done).length,
    active:   $tasks.filter(t => !t.done).length,
    progress: $tasks.length ? Math.round($tasks.filter(t => t.done).length / $tasks.length * 100) : 0,
  }))

  // ── Reaktiv deklaration ($:) ─────────────────────────────────────────────
  let filterDone = false
  $: filtered = filterDone ? $tasks.filter(t => !t.done) : $tasks

  let newTitle = ''
  let nextId = 6

  function addTask() {
    if (!newTitle.trim()) return
    tasks.update(ts => [...ts, { id: nextId++, title: newTitle.trim(), done: false, priority: 'medium' }])
    newTitle = ''
  }

  function toggle(id: number) {
    tasks.update(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function remove(id: number) {
    tasks.update(ts => ts.filter(t => t.id !== id))
  }

  const priorityColor: Record<string, string> = {
    high: '#ef4444', medium: '#f59e0b', low: '#22c55e'
  }

  // ── Counter demo ─────────────────────────────────────────────────────────
  let count = 0
  $: doubled  = count * 2
  $: isEven   = count % 2 === 0

  // ── Active tab ────────────────────────────────────────────────────────────
  type Tab = 'tasks' | 'reactive' | 'concepts'
  let activeTab: Tab = 'tasks'
</script>

<div class="app">
  <!-- Topbar -->
  <div class="topbar">
    <a href={portfolioUrl} class="back-link">← Portfolio</a>
    <div class="topbar-center">
      <span class="badge svelte">Svelte 4</span>
      <span class="badge stores">Stores</span>
      <span class="badge transitions">Transitions</span>
    </div>
    <div style="width:100px" />
  </div>

  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Svelte Demo</h1>
      <p class="page-subtitle">
        Svelte compiles to vanilla JS — no virtual DOM, no runtime. Reactivity
        is built into the language itself with <code>$:</code> labels and stores.
      </p>
    </div>

    <div class="tabs">
      {#each ([['tasks','Task Board'],['reactive','Reactive ($:)'],['concepts','Key Concepts']] as [Tab, string][] as const) as [key, label]}
        <button class="tab" class:active={activeTab === key} on:click={() => activeTab = key}>
          {label}
        </button>
      {/each}
    </div>

    <!-- Task Board tab -->
    {#if activeTab === 'tasks'}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <!-- Stats -->
        <div class="stats-row">
          <div class="stat">
            <div class="stat-num">{$stats.total}</div>
            <div class="stat-lbl">Total</div>
          </div>
          <div class="stat">
            <div class="stat-num done">{$stats.done}</div>
            <div class="stat-lbl">Done</div>
          </div>
          <div class="stat">
            <div class="stat-num active">{$stats.active}</div>
            <div class="stat-lbl">Active</div>
          </div>
          <div class="progress-wrap">
            <div class="progress-label">
              <span>Progress</span><span class="pct">{$stats.progress}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: {$stats.progress}%" />
            </div>
          </div>
        </div>

        <!-- Add + filter -->
        <div class="controls">
          <input bind:value={newTitle} class="inp" placeholder="New task..." on:keydown={e => e.key === 'Enter' && addTask()} />
          <button class="btn-add" on:click={addTask}>Add</button>
          <label class="toggle-label">
            <input type="checkbox" bind:checked={filterDone} />
            Active only
          </label>
        </div>

        <!-- Task list -->
        <div class="task-list">
          {#each filtered as task (task.id)}
            <div
              class="task-item"
              class:done={task.done}
              animate:flip={{ duration: 250 }}
              in:fly={{ y: -12, duration: 200 }}
              out:slide={{ duration: 180 }}
            >
              <div class="task-dot" style="background: {priorityColor[task.priority]}" />
              <span class="task-title">{task.title}</span>
              <button class="btn-toggle" on:click={() => toggle(task.id)}>
                {task.done ? '↩' : '✓'}
              </button>
              <button class="btn-del" on:click={() => remove(task.id)}>×</button>
            </div>
          {/each}
          {#if filtered.length === 0}
            <div class="empty" transition:fade>No tasks here</div>
          {/if}
        </div>
      </div>

    <!-- Reactive tab -->
    {:else if activeTab === 'reactive'}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <div class="reactive-demo">
          <div class="counter-section">
            <div class="code-label">Reactive declarations with <code>$:</code></div>
            <pre class="code-block">let count = 0
$: doubled = count * 2
$: isEven  = count % 2 === 0</pre>

            <div class="counter-display">
              <button class="counter-btn" on:click={() => count--}>−</button>
              <div class="counter-value">{count}</div>
              <button class="counter-btn" on:click={() => count++}>+</button>
            </div>

            <div class="reactive-values">
              <div class="rv-row">
                <span class="rv-label">count</span>
                <span class="rv-value">{count}</span>
              </div>
              <div class="rv-row">
                <span class="rv-label">doubled</span>
                <span class="rv-value accent">{doubled}</span>
              </div>
              <div class="rv-row">
                <span class="rv-label">isEven</span>
                <span class="rv-value" class:green={isEven} class:red={!isEven}>{isEven}</span>
              </div>
            </div>
          </div>

          <div class="store-section">
            <div class="code-label">Derived store — auto-updates from <code>$tasks</code></div>
            <pre class="code-block">const stats = derived(tasks, $tasks => (&#123;
  total:    $tasks.length,
  done:     $tasks.filter(t => t.done).length,
  progress: Math.round(done / total * 100),
&#125;))</pre>
            <div class="reactive-values">
              <div class="rv-row"><span class="rv-label">$stats.total</span><span class="rv-value">{$stats.total}</span></div>
              <div class="rv-row"><span class="rv-label">$stats.done</span><span class="rv-value green">{$stats.done}</span></div>
              <div class="rv-row"><span class="rv-label">$stats.progress</span><span class="rv-value accent">{$stats.progress}%</span></div>
            </div>
            <p class="store-note">Change tasks in the "Task Board" tab — these update instantly.</p>
          </div>
        </div>
      </div>

    <!-- Concepts tab -->
    {:else if activeTab === 'concepts'}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <div class="concepts-grid">
          {#each [
            { icon: '⚡', title: 'No virtual DOM', body: 'Svelte compiles your components to efficient imperative JS that directly updates the DOM.' },
            { icon: '🏪', title: 'Stores', body: 'writable(), readable(), and derived() give you reactive shared state without a framework.' },
            { icon: '💫', title: 'Transitions', body: 'Built-in fade, fly, slide, scale. No library needed — just import and use.' },
            { icon: '🎬', title: 'animate:flip()', body: 'Svelte animates list reordering automatically — just add animate:flip to the element.' },
            { icon: '$:', title: 'Reactive labels', body: '$: doubled = count * 2 — re-runs whenever count changes. Like computed, but simpler.' },
            { icon: '📦', title: 'Tiny bundle', body: 'No runtime shipped. A Svelte app is just compiled JS. This demo is under 30 kB gzipped.' },
          ] as concept}
            <div class="concept-card">
              <div class="concept-icon">{concept.icon}</div>
              <div class="concept-title">{concept.title}</div>
              <div class="concept-body">{concept.body}</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(html, body) { background: #060610; color: #e2e8f0; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .app { min-height: 100vh; }

  .topbar { background: rgba(6,6,16,.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.06); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; }
  .back-link:hover { color: #e2e8f0; }
  .topbar-center { display: flex; gap: 6px; }
  .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
  .badge.svelte { background: rgba(255,62,0,.12); border: 1px solid rgba(255,62,0,.3); color: #ff6b35; }
  .badge.stores { background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.25); color: #818cf8; }
  .badge.transitions { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #22c55e; }

  .container { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
  .page-header { margin-bottom: 32px; }
  .page-title { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
  .page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 560px; }
  .page-subtitle code { font-family: 'JetBrains Mono', monospace; color: #818cf8; background: rgba(99,102,241,.08); border-radius: 4px; padding: 1px 6px; }

  .tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
  .tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
  .tab:hover { color: #e2e8f0; }
  .tab.active { background: rgba(255,62,0,.1); border-color: rgba(255,62,0,.3); color: #ff6b35; }

  .panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; display: flex; flex-direction: column; gap: 20px; }

  /* Stats */
  .stats-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .stat-num { font-size: 28px; font-weight: 800; letter-spacing: -.02em; color: #94a3b8; }
  .stat-num.done { color: #22c55e; }
  .stat-num.active { color: #f59e0b; }
  .stat-lbl { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: .07em; }
  .progress-wrap { flex: 1; min-width: 140px; }
  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
  .pct { color: #22c55e; font-weight: 600; }
  .progress-track { height: 4px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a); border-radius: 2px; transition: width .5s ease; }

  /* Controls */
  .controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .inp { flex: 1; min-width: 180px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 9px 13px; font-size: 13px; color: #e2e8f0; font-family: inherit; outline: none; transition: border-color .15s; }
  .inp:focus { border-color: rgba(255,62,0,.4); }
  .btn-add { padding: 9px 18px; border-radius: 8px; background: rgba(255,62,0,.15); border: 1px solid rgba(255,62,0,.3); color: #ff6b35; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
  .btn-add:hover { background: rgba(255,62,0,.25); }
  .toggle-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; cursor: pointer; }
  .toggle-label input { accent-color: #ff6b35; }

  /* Task list */
  .task-list { display: flex; flex-direction: column; gap: 6px; }
  .task-item { display: flex; align-items: center; gap: 10px; background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 9px; padding: 12px 14px; transition: background .15s; }
  .task-item.done .task-title { text-decoration: line-through; color: #475569; }
  .task-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .task-title { flex: 1; font-size: 14px; color: #94a3b8; }
  .btn-toggle, .btn-del { background: none; border: none; cursor: pointer; font-size: 15px; padding: 2px 6px; border-radius: 5px; transition: all .15s; }
  .btn-toggle { color: #64748b; }
  .btn-toggle:hover { color: #22c55e; background: rgba(34,197,94,.08); }
  .btn-del { color: #334155; }
  .btn-del:hover { color: #ef4444; background: rgba(239,68,68,.08); }
  .empty { text-align: center; color: #334155; font-size: 13px; padding: 24px; }

  /* Reactive tab */
  .reactive-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
  .code-label code { font-family: 'JetBrains Mono', monospace; color: #ff6b35; background: rgba(255,62,0,.08); border-radius: 4px; padding: 1px 5px; }
  .code-block { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.65; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 14px; white-space: pre; margin-bottom: 16px; }
  .counter-display { display: flex; align-items: center; gap: 20px; justify-content: center; margin: 20px 0; }
  .counter-btn { width: 40px; height: 40px; border-radius: 8px; background: rgba(255,62,0,.12); border: 1px solid rgba(255,62,0,.25); color: #ff6b35; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .counter-btn:hover { background: rgba(255,62,0,.22); }
  .counter-value { font-size: 48px; font-weight: 800; letter-spacing: -.03em; color: #e2e8f0; min-width: 80px; text-align: center; }
  .reactive-values { display: flex; flex-direction: column; gap: 8px; }
  .rv-row { display: flex; align-items: center; justify-content: space-between; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 7px; padding: 8px 12px; }
  .rv-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; }
  .rv-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #94a3b8; }
  .rv-value.accent { color: #818cf8; }
  .rv-value.green { color: #22c55e; }
  .rv-value.red { color: #ef4444; }
  .store-note { font-size: 12px; color: #475569; margin-top: 12px; line-height: 1.5; }

  /* Concepts tab */
  .concepts-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .concept-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
  .concept-icon { font-size: 20px; font-weight: 700; color: #ff6b35; font-family: 'JetBrains Mono', monospace; }
  .concept-title { font-size: 14px; font-weight: 700; color: #e2e8f0; }
  .concept-body { font-size: 12px; color: #64748b; line-height: 1.6; }

  @media (max-width: 680px) {
    .reactive-demo { grid-template-columns: 1fr; }
    .concepts-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
