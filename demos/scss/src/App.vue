<script setup lang="ts">
import { ref } from 'vue'

const portfolioUrl = '/'
type Tab = 'variables' | 'nesting' | 'mixins' | 'layout'
const activeTab = ref<Tab>('variables')

const colors = [
  { name: '$color-primary', value: '#6366f1', desc: 'Indigo — CTAs, links' },
  { name: '$color-success', value: '#22c55e', desc: 'Green — positive states' },
  { name: '$color-warning', value: '#f59e0b', desc: 'Amber — alerts, badges' },
  { name: '$color-danger',  value: '#ef4444', desc: 'Red — errors, destructive' },
  { name: '$color-bg',      value: '#060610', desc: 'Page background' },
  { name: '$color-surface', value: '#0d0d1a', desc: 'Card background' },
]

const gaps = ['4px', '8px', '12px', '16px', '24px', '32px', '48px']

const flexDir = ref<'row' | 'column'>('row')
const flexWrap = ref(true)
const justifyContent = ref('flex-start')
const alignItems = ref('center')
const gapSize = ref('16px')

const gridCols = ref(3)
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← Portfolio</a>
      <div class="topbar-center">
        <span class="badge scss">SCSS</span>
        <span class="badge flexbox">Flexbox</span>
        <span class="badge grid">CSS Grid</span>
      </div>
      <div style="width:100px" />
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">SCSS Showcase</h1>
        <p class="page-subtitle">
          Variables, nesting, mixins, and interactive Flexbox/Grid builders.
          All styles in this portfolio are written with SCSS principles.
        </p>
      </div>

      <div class="tabs">
        <button v-for="[k,l] in [['variables','Variables'],['nesting','Nesting'],['mixins','Mixins & Functions'],['layout','Flexbox & Grid']]"
          :key="k" class="tab" :class="{ active: activeTab === k }" @click="activeTab = (k as Tab)">{{ l }}</button>
      </div>

      <!-- Variables -->
      <div v-if="activeTab === 'variables'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">_variables.scss</div>
            <pre class="scss-code">// Colors
$color-primary: #6366f1;
$color-success: #22c55e;
$color-warning: #f59e0b;
$color-danger:  #ef4444;

// Spacing scale
$space-1:  4px;
$space-2:  8px;
$space-3: 12px;
$space-4: 16px;
$space-6: 24px;
$space-8: 32px;

// Typography
$font-sans: 'Inter', system-ui, sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Radius
$radius-sm: 6px;
$radius-md: 10px;
$radius-lg: 14px;</pre>
          </div>
          <div>
            <div class="code-label">Color palette — live</div>
            <div class="color-grid">
              <div v-for="c in colors" :key="c.name" class="color-swatch">
                <div class="swatch-block" :style="{ background: c.value }" />
                <div class="swatch-name">{{ c.name }}</div>
                <div class="swatch-val">{{ c.value }}</div>
                <div class="swatch-desc">{{ c.desc }}</div>
              </div>
            </div>
            <div class="code-label" style="margin-top:20px">Spacing scale</div>
            <div class="spacing-row">
              <div v-for="g in gaps" :key="g" class="spacing-item">
                <div class="spacing-block" :style="{ width: g, height: g, minWidth: g }" />
                <div class="spacing-label">{{ g }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nesting -->
      <div v-else-if="activeTab === 'nesting'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">SCSS nesting</div>
            <pre class="scss-code">.card {
  background: $color-surface;
  border-radius: $radius-md;
  padding: $space-6;

  &:hover {
    border-color: rgba($color-primary, .4);
    transform: translateY(-2px);
  }

  &--featured {
    border-color: $color-primary;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 700;

    &:first-child { margin-top: 0; }
  }

  &__body {
    color: rgba(white, .6);
    margin-top: $space-3;
  }
}</pre>
          </div>
          <div>
            <div class="code-label">Compiled output — live examples</div>
            <div class="card-demo">
              <div class="demo-card">
                <div class="demo-card__title">Regular card</div>
                <div class="demo-card__body">Hover to see :hover state</div>
              </div>
              <div class="demo-card demo-card--featured">
                <div class="demo-card__title">Featured card</div>
                <div class="demo-card__body">Modified with BEM modifier class</div>
              </div>
            </div>
            <div class="code-label" style="margin-top:20px">BEM naming with SCSS</div>
            <pre class="scss-code small">.block { }
.block__element { }
.block--modifier { }
// &__element compiles to .block__element</pre>
          </div>
        </div>
      </div>

      <!-- Mixins -->
      <div v-else-if="activeTab === 'mixins'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">Mixins & functions</div>
            <pre class="scss-code">// Mixin: responsive breakpoint
@mixin breakpoint($bp) {
  @if $bp == 'sm' {
    @media (max-width: 640px) { @content; }
  } @else if $bp == 'md' {
    @media (max-width: 768px) { @content; }
  } @else if $bp == 'lg' {
    @media (max-width: 1024px) { @content; }
  }
}

// Mixin: flex shorthand
@mixin flex($dir: row, $align: center, $justify: flex-start, $gap: 0) {
  display: flex;
  flex-direction: $dir;
  align-items: $align;
  justify-content: $justify;
  gap: $gap;
}

// Function: lighten brand color
@function brand-alpha($alpha) {
  @return rgba($color-primary, $alpha);
}

// @each loop
$sizes: 1, 2, 3, 4, 6, 8;
@each $s in $sizes {
  .p-#{$s} { padding: #{$s * 4}px; }
  .m-#{$s} { margin:  #{$s * 4}px; }
}</pre>
          </div>
          <div>
            <div class="code-label">Generated utility classes (from @each)</div>
            <div class="util-demo">
              <div v-for="s in [1,2,3,4,6,8]" :key="s"
                class="util-box" :style="{ padding: (s*4)+'px', margin: '4px' }">
                .p-{{ s }}
              </div>
            </div>
            <div class="code-label" style="margin-top:20px">brand-alpha() function</div>
            <div class="alpha-demo">
              <div v-for="a in [1, .7, .4, .2, .08]" :key="a"
                class="alpha-swatch" :style="{ background: `rgba(99,102,241,${a})` }">
                {{ a }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout -->
      <div v-else-if="activeTab === 'layout'" class="panel">
        <div class="layout-builder">
          <!-- Flexbox controls -->
          <div class="builder-section">
            <div class="code-label">Flexbox playground</div>
            <div class="controls-row">
              <label class="ctrl-label">flex-direction
                <select v-model="flexDir" class="ctrl-select">
                  <option value="row">row</option>
                  <option value="column">column</option>
                </select>
              </label>
              <label class="ctrl-label">justify-content
                <select v-model="justifyContent" class="ctrl-select">
                  <option>flex-start</option>
                  <option>center</option>
                  <option>flex-end</option>
                  <option>space-between</option>
                  <option>space-around</option>
                </select>
              </label>
              <label class="ctrl-label">align-items
                <select v-model="alignItems" class="ctrl-select">
                  <option>center</option>
                  <option>flex-start</option>
                  <option>flex-end</option>
                  <option>stretch</option>
                </select>
              </label>
              <label class="ctrl-label">gap
                <select v-model="gapSize" class="ctrl-select">
                  <option v-for="g in gaps" :key="g">{{ g }}</option>
                </select>
              </label>
              <label class="ctrl-label ctrl-check">
                <input type="checkbox" v-model="flexWrap" /> flex-wrap
              </label>
            </div>
            <div class="flex-preview"
              :style="{ flexDirection: flexDir, justifyContent, alignItems, gap: gapSize, flexWrap: flexWrap ? 'wrap' : 'nowrap' }">
              <div v-for="i in 6" :key="i" class="flex-item" :style="{ height: (i % 3 === 0 ? 60 : 40)+'px' }">{{ i }}</div>
            </div>
            <pre class="scss-code small">display: flex;
flex-direction: {{ flexDir }};
justify-content: {{ justifyContent }};
align-items: {{ alignItems }};
gap: {{ gapSize }};
flex-wrap: {{ flexWrap ? 'wrap' : 'nowrap' }};</pre>
          </div>

          <!-- Grid controls -->
          <div class="builder-section">
            <div class="code-label">CSS Grid playground</div>
            <label class="ctrl-label">columns: {{ gridCols }}
              <input type="range" v-model.number="gridCols" min="1" max="6" class="ctrl-range" />
            </label>
            <div class="grid-preview" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }">
              <div v-for="i in 9" :key="i" class="grid-item">{{ i }}</div>
            </div>
            <pre class="scss-code small">display: grid;
grid-template-columns: repeat({{ gridCols }}, 1fr);
gap: 12px;</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; }
.topbar { background: rgba(6,6,16,.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.06); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
.back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; }
.back-link:hover { color: #e2e8f0; }
.topbar-center { display: flex; gap: 6px; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.scss    { background: rgba(204,102,153,.12); border: 1px solid rgba(204,102,153,.3); color: #cc6699; }
.badge.flexbox { background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.25); color: #818cf8; }
.badge.grid    { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.2); color: #f59e0b; }
.container { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 560px; }
.tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(204,102,153,.1); border-color: rgba(204,102,153,.3); color: #cc6699; }
.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
.scss-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 16px; white-space: pre; overflow-x: auto; }
.scss-code.small { font-size: 11px; padding: 10px; margin-top: 10px; }
.color-grid { display: flex; flex-direction: column; gap: 8px; }
.color-swatch { display: flex; align-items: center; gap: 10px; }
.swatch-block { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; }
.swatch-name { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cc6699; width: 140px; flex-shrink: 0; }
.swatch-val  { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; width: 70px; }
.swatch-desc { font-size: 11px; color: #475569; }
.spacing-row { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.spacing-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.spacing-block { background: rgba(204,102,153,.3); border: 1px solid rgba(204,102,153,.4); border-radius: 3px; }
.spacing-label { font-size: 10px; color: #475569; font-family: 'JetBrains Mono', monospace; }
.card-demo { display: flex; flex-direction: column; gap: 12px; }
.demo-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 16px; transition: all .2s; cursor: default; }
.demo-card:hover { border-color: rgba(99,102,241,.4); transform: translateY(-2px); }
.demo-card--featured { border-color: rgba(99,102,241,.4); }
.demo-card__title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; }
.demo-card__body { font-size: 13px; color: #64748b; }
.util-demo { display: flex; flex-wrap: wrap; align-items: flex-start; }
.util-box { background: rgba(204,102,153,.15); border: 1px solid rgba(204,102,153,.25); border-radius: 4px; font-size: 11px; color: #cc6699; font-family: 'JetBrains Mono', monospace; }
.alpha-demo { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.alpha-swatch { width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #fff; font-weight: 600; }
.layout-builder { display: flex; flex-direction: column; gap: 32px; }
.builder-section { display: flex; flex-direction: column; gap: 12px; }
.controls-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; }
.ctrl-label { font-size: 12px; color: #64748b; display: flex; flex-direction: column; gap: 4px; }
.ctrl-label.ctrl-check { flex-direction: row; align-items: center; gap: 6px; }
.ctrl-select { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; padding: 5px 8px; font-size: 12px; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; cursor: pointer; outline: none; }
.ctrl-range { accent-color: #cc6699; cursor: pointer; }
.flex-preview { display: flex; background: #060610; border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 16px; min-height: 100px; transition: all .2s; }
.flex-item { background: rgba(204,102,153,.2); border: 1px solid rgba(204,102,153,.4); border-radius: 6px; padding: 0 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #cc6699; min-width: 36px; transition: all .2s; }
.grid-preview { display: grid; gap: 12px; background: #060610; border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 16px; transition: all .2s; }
.grid-item { background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.3); border-radius: 6px; padding: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #f59e0b; transition: all .2s; }
@media(max-width:680px) { .split { grid-template-columns: 1fr; } }
</style>
