<script>
  import { writable, derived } from 'svelte/store'
  import { fade, fly, slide } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  const portfolioUrl = '/'

  const tasks = writable([
    { id: 1, title: 'Learn Svelte stores',    done: true,  priority: 'high' },
    { id: 2, title: 'Build reactive UI',       done: true,  priority: 'high' },
    { id: 3, title: 'Use Svelte transitions',  done: false, priority: 'medium' },
    { id: 4, title: 'Animate with flip()',     done: false, priority: 'medium' },
    { id: 5, title: 'Deploy with Vite',        done: false, priority: 'low' },
  ])

  const stats = derived(tasks, $t => ({
    total: $t.length,
    done:  $t.filter(t => t.done).length,
    active: $t.filter(t => !t.done).length,
    progress: $t.length ? Math.round($t.filter(t => t.done).length / $t.length * 100) : 0,
  }))

  let filterDone = false
  $: filtered = filterDone ? $tasks.filter(t => !t.done) : $tasks

  let newTitle = ''
  let nextId = 6

  function addTask() {
    if (!newTitle.trim()) return
    tasks.update(ts => [...ts, { id: nextId++, title: newTitle.trim(), done: false, priority: 'medium' }])
    newTitle = ''
  }
  function toggle(id) { tasks.update(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t)) }
  function remove(id) { tasks.update(ts => ts.filter(t => t.id !== id)) }

  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }

  let count = 0
  $: doubled = count * 2
  $: isEven  = count % 2 === 0

  const tabs = [
    { key: 'tasks',    label: 'Task Board' },
    { key: 'reactive', label: 'Reactive ($:)' },
    { key: 'concepts', label: 'Key Concepts' },
  ]
  let activeTab = 'tasks'

  const concepts = [
    { icon: '⚡', title: 'No virtual DOM',  body: 'Svelte compiles your components to efficient imperative JS that directly updates the DOM.' },
    { icon: '🏪', title: 'Stores',           body: 'writable(), readable(), and derived() give you reactive shared state without a framework.' },
    { icon: '💫', title: 'Transitions',      body: 'Built-in fade, fly, slide, scale. No library needed — just import and use.' },
    { icon: '🎬', title: 'animate:flip()',   body: 'Svelte animates list reordering automatically — just add animate:flip to the element.' },
    { icon: '$:', title: 'Reactive labels',  body: '$: doubled = count * 2 — re-runs whenever count changes. Like computed, but simpler.' },
    { icon: '📦', title: 'Tiny bundle',      body: 'No runtime shipped. A Svelte app is just compiled JS. This demo is under 30 kB gzipped.' },
  ]
</script>

<div class="app">
  <div class="topbar">
    <a href={portfolioUrl} class="back-link">← Portfolio</a>
    <div class="center">
      <span class="badge orange">Svelte 5</span>
      <span class="badge purple">Stores</span>
      <span class="badge green">Transitions</span>
    </div>
    <div style="width:100px"></div>
  </div>

  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Svelte Demo</h1>
      <p class="page-subtitle">
        Svelte compiles to vanilla JS — no virtual DOM, no runtime. Reactivity is built into the language with <code>$:</code> labels and stores.
      </p>
    </div>

    <div class="tabs">
      {#each tabs as tab}
        <button class="tab" class:active={activeTab === tab.key} on:click={() => activeTab = tab.key}>
          {tab.label}
        </button>
      {/each}
    </div>

    {#if activeTab === 'tasks'}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <div class="stats-row">
          <div class="stat"><div class="stat-num">{$stats.total}</div><div class="stat-lbl">Total</div></div>
          <div class="stat"><div class="stat-num green">{$stats.done}</div><div class="stat-lbl">Done</div></div>
          <div class="stat"><div class="stat-num amber">{$stats.active}</div><div class="stat-lbl">Active</div></div>
          <div class="progress-wrap">
            <div class="progress-label"><span>Progress</span><span class="pct">{$stats.progress}%</span></div>
            <div class="track"><div class="fill" style="width:{$stats.progress}%"></div></div>
          </div>
        </div>

        <div class="controls">
          <input bind:value={newTitle} class="inp" placeholder="New task..." on:keydown={e => e.key === 'Enter' && addTask()} />
          <button class="btn-add" on:click={addTask}>Add</button>
          <label class="chk"><input type="checkbox" bind:checked={filterDone} /> Active only</label>
        </div>

        <div class="task-list">
          {#each filtered as task (task.id)}
            <div class="task-item" class:done={task.done}
              animate:flip={{ duration: 250 }}
              in:fly={{ y: -12, duration: 200 }}
              out:slide={{ duration: 180 }}>
              <div class="dot" style="background:{priorityColor[task.priority]}"></div>
              <span class="task-title">{task.title}</span>
              <button class="btn-toggle" on:click={() => toggle(task.id)}>{task.done ? '↩' : '✓'}</button>
              <button class="btn-del" on:click={() => remove(task.id)}>×</button>
            </div>
          {/each}
          {#if filtered.length === 0}<div class="empty" transition:fade>No tasks here</div>{/if}
        </div>
      </div>

    {:else if activeTab === 'reactive'}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <div class="split">
          <div>
            <div class="code-label">Reactive declarations with <code>$:</code></div>
            <pre class="codeblock">let count = 0
$: doubled = count * 2
$: isEven  = count % 2 === 0</pre>
            <div class="counter-row">
              <button class="cbtn" on:click={() => count--}>−</button>
              <div class="cval">{count}</div>
              <button class="cbtn" on:click={() => count++}>+</button>
            </div>
            <div class="rv-list">
              <div class="rv-row"><span class="rv-key">count</span><span class="rv-val">{count}</span></div>
              <div class="rv-row"><span class="rv-key">doubled</span><span class="rv-val purple">{doubled}</span></div>
              <div class="rv-row"><span class="rv-key">isEven</span><span class="rv-val" class:green={isEven} class:red={!isEven}>{isEven}</span></div>
            </div>
          </div>
          <div>
            <div class="code-label">Derived store — updates from <code>$tasks</code></div>
            <pre class="codeblock">const stats = derived(tasks, $t => ({'{'}
  total:    $t.length,
  done:     $t.filter(t => t.done).length,
  progress: Math.round(done/total * 100),
{'}'}))</pre>
            <div class="rv-list">
              <div class="rv-row"><span class="rv-key">$stats.total</span><span class="rv-val">{$stats.total}</span></div>
              <div class="rv-row"><span class="rv-key">$stats.done</span><span class="rv-val green">{$stats.done}</span></div>
              <div class="rv-row"><span class="rv-key">$stats.progress</span><span class="rv-val purple">{$stats.progress}%</span></div>
            </div>
            <p class="note">Switch to "Task Board" and add/complete tasks — these update instantly.</p>
          </div>
        </div>
      </div>

    {:else if activeTab === 'concepts'}
      <div class="panel" transition:fade={{ duration: 150 }}>
        <div class="grid3">
          {#each concepts as c}
            <div class="concept">
              <div class="cicon">{c.icon}</div>
              <div class="ctitle">{c.title}</div>
              <div class="cbody">{c.body}</div>
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
  .center { display: flex; gap: 6px; }
  .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
  .badge.orange { background: rgba(255,62,0,.12); border: 1px solid rgba(255,62,0,.3); color: #ff6b35; }
  .badge.purple { background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.25); color: #818cf8; }
  .badge.green  { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #22c55e; }
  .container { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
  .page-header { margin-bottom: 32px; }
  .page-title { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
  .page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 560px; }
  .page-subtitle code { font-family: 'JetBrains Mono', monospace; color: #818cf8; background: rgba(99,102,241,.08); border-radius: 4px; padding: 1px 6px; }
  .tabs { display: flex; gap: 6px; margin-bottom: 20px; }
  .tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
  .tab:hover { color: #e2e8f0; }
  .tab.active { background: rgba(255,62,0,.1); border-color: rgba(255,62,0,.3); color: #ff6b35; }
  .panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; display: flex; flex-direction: column; gap: 20px; }
  .stats-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .stat-num { font-size: 28px; font-weight: 800; color: #94a3b8; }
  .stat-num.green { color: #22c55e; }
  .stat-num.amber { color: #f59e0b; }
  .stat-lbl { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: .07em; }
  .progress-wrap { flex: 1; min-width: 140px; }
  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
  .pct { color: #22c55e; font-weight: 600; }
  .track { height: 4px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
  .fill { height: 100%; background: linear-gradient(90deg,#22c55e,#16a34a); border-radius: 2px; transition: width .5s ease; }
  .controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .inp { flex: 1; min-width: 180px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 9px 13px; font-size: 13px; color: #e2e8f0; font-family: inherit; outline: none; }
  .inp:focus { border-color: rgba(255,62,0,.4); }
  .btn-add { padding: 9px 18px; border-radius: 8px; background: rgba(255,62,0,.15); border: 1px solid rgba(255,62,0,.3); color: #ff6b35; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .chk { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; cursor: pointer; }
  .task-list { display: flex; flex-direction: column; gap: 6px; }
  .task-item { display: flex; align-items: center; gap: 10px; background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 9px; padding: 12px 14px; }
  .task-item.done .task-title { text-decoration: line-through; color: #475569; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .task-title { flex: 1; font-size: 14px; color: #94a3b8; }
  .btn-toggle, .btn-del { background: none; border: none; cursor: pointer; font-size: 15px; padding: 2px 6px; border-radius: 5px; }
  .btn-toggle { color: #64748b; }
  .btn-toggle:hover { color: #22c55e; }
  .btn-del { color: #334155; }
  .btn-del:hover { color: #ef4444; }
  .empty { text-align: center; color: #334155; font-size: 13px; padding: 24px; }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
  .code-label code { font-family: 'JetBrains Mono', monospace; color: #ff6b35; }
  .codeblock { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.65; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 14px; white-space: pre; margin-bottom: 16px; }
  .counter-row { display: flex; align-items: center; gap: 20px; justify-content: center; margin: 20px 0; }
  .cbtn { width: 40px; height: 40px; border-radius: 8px; background: rgba(255,62,0,.12); border: 1px solid rgba(255,62,0,.25); color: #ff6b35; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .cval { font-size: 48px; font-weight: 800; color: #e2e8f0; min-width: 80px; text-align: center; }
  .rv-list { display: flex; flex-direction: column; gap: 8px; }
  .rv-row { display: flex; align-items: center; justify-content: space-between; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 7px; padding: 8px 12px; }
  .rv-key { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; }
  .rv-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #94a3b8; }
  .rv-val.purple { color: #818cf8; }
  .rv-val.green  { color: #22c55e; }
  .rv-val.red    { color: #ef4444; }
  .note { font-size: 12px; color: #475569; margin-top: 12px; line-height: 1.5; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .concept { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
  .cicon { font-size: 20px; font-weight: 700; color: #ff6b35; font-family: 'JetBrains Mono', monospace; }
  .ctitle { font-size: 14px; font-weight: 700; color: #e2e8f0; }
  .cbody { font-size: 12px; color: #64748b; line-height: 1.6; }
  @media (max-width: 680px) { .split { grid-template-columns: 1fr; } .grid3 { grid-template-columns: 1fr 1fr; } }
</style>
