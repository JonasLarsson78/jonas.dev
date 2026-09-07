<script setup lang="ts">
import { ref, computed } from 'vue'

const API          = '/api'
const portfolioUrl = '/'

type Tab = 'jwt' | 'oauth2'
const activeTab = ref<Tab>('jwt')

// ── JWT section ──────────────────────────────────────────────────────────────
const email    = ref('jonas@demo.com')
const password = ref('password123')
const loginLoading = ref(false)
const loginError = ref('')

interface TokenSet {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: { id: string; name: string; email: string; role: string }
}

const tokenSet = ref<TokenSet | null>(null)
const profileData = ref<{ user: object; tokenMeta: object } | null>(null)
const profileError = ref('')

const decoded = computed(() => {
  if (!tokenSet.value) return null
  const parts = tokenSet.value.accessToken.split('.')
  if (parts.length !== 3) return null
  try {
    const header  = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    return { header, payload, signature: parts[2].slice(0, 20) + '…' }
  } catch { return null }
})

async function login() {
  loginLoading.value = true
  loginError.value = ''
  tokenSet.value = null
  profileData.value = null
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const json = await res.json() as TokenSet & { error?: string }
    if (!res.ok) throw new Error(json.error ?? 'Login failed')
    tokenSet.value = json
  } catch (e) { loginError.value = (e as Error).message }
  loginLoading.value = false
}

async function fetchProfile() {
  if (!tokenSet.value) return
  profileError.value = ''
  profileData.value = null
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: { Authorization: `Bearer ${tokenSet.value.accessToken}` },
    })
    const json = await res.json() as typeof profileData.value & { error?: string }
    if (!res.ok) throw new Error((json as { error: string }).error)
    profileData.value = json
  } catch (e) { profileError.value = (e as Error).message }
}

async function refreshTokens() {
  if (!tokenSet.value) return
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokenSet.value.refreshToken }),
    })
    const json = await res.json() as Partial<TokenSet> & { error?: string }
    if (!res.ok) throw new Error(json.error)
    tokenSet.value = { ...tokenSet.value, ...json }
    profileData.value = null
  } catch (e) { loginError.value = (e as Error).message }
}

// ── OAuth2 section ───────────────────────────────────────────────────────────
const oauthStep = ref<'idle'|'authorizing'|'code'|'exchanging'|'done'>('idle')
const oauthCode = ref('')
const oauthTokens = ref<Partial<TokenSet> | null>(null)
const oauthError = ref('')
const oauthClientId = ref('demo-client-app')
const oauthRedirectUri = ref(window.location.origin + '/demos/auth/callback')

async function startOAuth() {
  oauthStep.value = 'authorizing'
  oauthError.value = ''
  oauthCode.value = ''
  oauthTokens.value = null
  await new Promise(r => setTimeout(r, 600))

  const state = Math.random().toString(36).slice(2, 8)
  const params = new URLSearchParams({
    client_id: oauthClientId.value,
    redirect_uri: oauthRedirectUri.value,
    response_type: 'code',
    state,
  })

  try {
    const res = await fetch(`${API}/auth/oauth/authorize?${params}`)
    const json = await res.json() as { code: string; redirectUrl: string; error?: string }
    if (!res.ok || json.error) throw new Error(json.error ?? 'Authorization failed')
    oauthCode.value = json.code
    oauthStep.value = 'code'
    await new Promise(r => setTimeout(r, 800))
    await exchangeCode(json.code)
  } catch (e) {
    oauthError.value = (e as Error).message
    oauthStep.value = 'idle'
  }
}

async function exchangeCode(code: string) {
  oauthStep.value = 'exchanging'
  await new Promise(r => setTimeout(r, 600))
  try {
    const res = await fetch(`${API}/auth/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, grant_type: 'authorization_code', client_id: oauthClientId.value }),
    })
    const json = await res.json() as Partial<TokenSet> & { error?: string }
    if (!res.ok) throw new Error(json.error)
    oauthTokens.value = json
    oauthStep.value = 'done'
  } catch (e) {
    oauthError.value = (e as Error).message
    oauthStep.value = 'code'
  }
}

function resetOAuth() { oauthStep.value = 'idle'; oauthCode.value = ''; oauthTokens.value = null; oauthError.value = '' }
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← Portfolio</a>
      <div class="topbar-center">
        <span class="badge jwt">JWT</span>
        <span class="badge oauth">OAuth2</span>
        <span class="badge node">Node.js + Express</span>
      </div>
      <div style="width:100px" />
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">JWT &amp; OAuth2</h1>
        <p class="page-subtitle">
          Live authentication flows — login, decode tokens, make protected requests,
          and walk through the OAuth2 authorization code flow step by step.
        </p>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'jwt' }"    @click="activeTab = 'jwt'">JWT</button>
        <button class="tab" :class="{ active: activeTab === 'oauth2' }" @click="activeTab = 'oauth2'">OAuth2 Flow</button>
      </div>

      <!-- JWT tab -->
      <div v-if="activeTab === 'jwt'" class="columns">
        <!-- Login -->
        <div class="panel">
          <div class="panel-title">1. Login → receive tokens</div>
          <div class="hint">Credentials: <code>jonas@demo.com</code> / <code>password123</code></div>
          <input v-model="email"    class="field" placeholder="email" />
          <input v-model="password" class="field" type="password" placeholder="password" />
          <button class="action-btn primary" :disabled="loginLoading" @click="login">
            {{ loginLoading ? 'Logging in…' : 'POST /auth/login' }}
          </button>
          <div v-if="loginError" class="err">{{ loginError }}</div>
          <div v-if="tokenSet" class="success-row">
            <div class="success-label">✅ Logged in as <strong>{{ tokenSet.user.name }}</strong></div>
            <div class="badge-row">
              <span class="mini-badge">{{ tokenSet.user.role }}</span>
              <span class="mini-badge">expires in {{ tokenSet.expiresIn }}s</span>
            </div>
          </div>
        </div>

        <!-- Token decoder -->
        <div class="panel">
          <div class="panel-title">2. Decode JWT structure</div>
          <div v-if="!decoded" class="empty-hint">Login first to see the token</div>
          <div v-else class="token-viewer">
            <div class="token-raw">
              <span class="tok-header">{{ tokenSet!.accessToken.split('.')[0] }}</span>.<span
                class="tok-payload">{{ tokenSet!.accessToken.split('.')[1] }}</span>.<span
                class="tok-sig">{{ tokenSet!.accessToken.split('.')[2].slice(0,12) }}…</span>
            </div>
            <div class="token-parts">
              <div class="token-part header-part">
                <div class="part-label">Header</div>
                <pre>{{ JSON.stringify(decoded.header, null, 2) }}</pre>
              </div>
              <div class="token-part payload-part">
                <div class="part-label">Payload</div>
                <pre>{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
              </div>
              <div class="token-part sig-part">
                <div class="part-label">Signature</div>
                <pre>HMACSHA256(base64(header) + "." + base64(payload), secret)</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Protected request -->
        <div class="panel">
          <div class="panel-title">3. Access protected endpoint</div>
          <div class="endpoint-row"><code>GET /auth/profile</code> <span class="auth-label">Authorization: Bearer …</span></div>
          <button class="action-btn" :disabled="!tokenSet" @click="fetchProfile">
            Fetch profile
          </button>
          <div v-if="profileError" class="err">{{ profileError }}</div>
          <div v-if="profileData" class="json-result">
            <pre>{{ JSON.stringify(profileData, null, 2) }}</pre>
          </div>
        </div>

        <!-- Refresh -->
        <div class="panel">
          <div class="panel-title">4. Refresh access token</div>
          <p class="hint">Access tokens expire in 15 min. Use the refresh token to get a new pair without re-login.</p>
          <button class="action-btn" :disabled="!tokenSet" @click="refreshTokens">
            POST /auth/refresh
          </button>
          <div v-if="tokenSet" class="success-row" style="margin-top:10px">
            <div class="success-label">Refresh token stored server-side — single-use, expires in 7d</div>
          </div>
        </div>
      </div>

      <!-- OAuth2 tab -->
      <div v-else class="panel">
        <div class="panel-title">OAuth2 Authorization Code Flow</div>
        <p class="hint" style="margin-bottom:20px">
          Click "Start" to walk through the full flow: authorization → code → token exchange.
          The server auto-approves for demo purposes.
        </p>

        <div class="flow-steps">
          <div class="flow-step" :class="{ active: oauthStep !== 'idle', done: ['code','exchanging','done'].includes(oauthStep) }">
            <div class="step-num">1</div>
            <div class="step-body">
              <div class="step-title">Authorization Request</div>
              <code class="step-code">GET /auth/oauth/authorize?client_id={{ oauthClientId }}&amp;redirect_uri={{ oauthRedirectUri }}&amp;response_type=code</code>
            </div>
          </div>

          <div class="flow-step" :class="{ active: ['code','exchanging','done'].includes(oauthStep), done: ['exchanging','done'].includes(oauthStep) }">
            <div class="step-num">2</div>
            <div class="step-body">
              <div class="step-title">Authorization Code</div>
              <div v-if="oauthCode" class="code-pill">code = <strong>{{ oauthCode }}</strong> (expires in 60s)</div>
              <div v-else class="step-waiting">Waiting for server response…</div>
            </div>
          </div>

          <div class="flow-step" :class="{ active: ['exchanging','done'].includes(oauthStep), done: oauthStep === 'done' }">
            <div class="step-num">3</div>
            <div class="step-body">
              <div class="step-title">Token Exchange</div>
              <code class="step-code">POST /auth/oauth/token { code, grant_type: "authorization_code", client_id }</code>
            </div>
          </div>

          <div class="flow-step" :class="{ active: oauthStep === 'done', done: oauthStep === 'done' }">
            <div class="step-num">4</div>
            <div class="step-body">
              <div class="step-title">Access Token</div>
              <div v-if="oauthTokens" class="success-row">
                <div class="success-label">✅ token_type: Bearer · expires_in: {{ oauthTokens.expiresIn }}s</div>
              </div>
              <div v-else class="step-waiting">Waiting…</div>
            </div>
          </div>
        </div>

        <div v-if="oauthError" class="err" style="margin-top:16px">{{ oauthError }}</div>

        <div class="flow-actions">
          <button v-if="oauthStep === 'idle' || oauthStep === 'done'" class="action-btn primary" @click="startOAuth">
            {{ oauthStep === 'done' ? 'Run again' : 'Start OAuth2 flow' }}
          </button>
          <div v-else class="running-hint">Flow in progress…</div>
          <button v-if="oauthStep !== 'idle'" class="action-btn" @click="resetOAuth">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; }
.topbar { background: rgba(6,6,16,.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.06); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
.back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; transition: color .15s; }
.back-link:hover { color: #e2e8f0; }
.topbar-center { display: flex; gap: 6px; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.jwt   { background: rgba(234,179,8,.1);   border: 1px solid rgba(234,179,8,.25);  color: #eab308; }
.badge.oauth { background: rgba(168,85,247,.1);  border: 1px solid rgba(168,85,247,.25); color: #a855f7; }
.badge.node  { background: rgba(51,153,51,.1);   border: 1px solid rgba(51,153,51,.25);  color: #5cb85c; }

.container { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title  { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 580px; }

.tabs { display: flex; gap: 6px; margin-bottom: 24px; }
.tab { padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; transition: all .15s; font-family: inherit; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(234,179,8,.1); border-color: rgba(234,179,8,.3); color: #eab308; }

.columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 12px; }
.panel-title { font-size: 14px; font-weight: 700; color: #e2e8f0; }
.hint { font-size: 12px; color: #475569; line-height: 1.5; }
.hint code { font-family: 'JetBrains Mono', monospace; color: #818cf8; background: rgba(99,102,241,.08); border-radius: 4px; padding: 1px 5px; }

.field { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 7px; padding: 9px 12px; font-size: 13px; color: #e2e8f0; font-family: inherit; outline: none; transition: border-color .15s; width: 100%; }
.field:focus { border-color: rgba(234,179,8,.4); }
.action-btn { padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); color: #94a3b8; cursor: pointer; transition: all .15s; font-family: inherit; }
.action-btn:hover:not(:disabled) { background: rgba(255,255,255,.08); color: #e2e8f0; }
.action-btn:disabled { opacity: .4; cursor: not-allowed; }
.action-btn.primary { background: rgba(234,179,8,.12); border-color: rgba(234,179,8,.3); color: #eab308; }
.action-btn.primary:hover:not(:disabled) { background: rgba(234,179,8,.2); }
.err { font-size: 12px; color: #f87171; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); border-radius: 6px; padding: 8px 12px; }
.success-row { display: flex; flex-direction: column; gap: 6px; }
.success-label { font-size: 13px; color: #22c55e; }
.badge-row { display: flex; gap: 6px; }
.mini-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,.04); color: #64748b; }
.empty-hint { color: #334155; font-size: 13px; text-align: center; padding: 20px 0; }

.token-viewer { display: flex; flex-direction: column; gap: 10px; }
.token-raw { font-family: 'JetBrains Mono', monospace; font-size: 10px; word-break: break-all; line-height: 1.5; }
.tok-header  { color: #f59e0b; }
.tok-payload { color: #a78bfa; }
.tok-sig     { color: #34d399; }
.token-parts { display: flex; flex-direction: column; gap: 6px; }
.token-part  { border-radius: 6px; padding: 10px; }
.header-part  { background: rgba(245,158,11,.06);  border: 1px solid rgba(245,158,11,.2); }
.payload-part { background: rgba(167,139,250,.06); border: 1px solid rgba(167,139,250,.2); }
.sig-part     { background: rgba(52,211,153,.05);  border: 1px solid rgba(52,211,153,.2); }
.part-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 6px; }
.token-part pre { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #94a3b8; white-space: pre-wrap; word-break: break-all; }

.endpoint-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.endpoint-row code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #818cf8; background: rgba(99,102,241,.08); border-radius: 4px; padding: 3px 8px; }
.auth-label { font-size: 11px; color: #334155; }
.json-result { background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 12px; }
.json-result pre { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #94a3b8; white-space: pre-wrap; }

/* OAuth2 flow */
.flow-steps { display: flex; flex-direction: column; gap: 12px; }
.flow-step { display: flex; gap: 14px; align-items: flex-start; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,.04); background: rgba(255,255,255,.01); transition: all .3s; }
.flow-step.active { border-color: rgba(168,85,247,.2); background: rgba(168,85,247,.04); }
.flow-step.done   { border-color: rgba(34,197,94,.2);  background: rgba(34,197,94,.04); }
.step-num { width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #64748b; flex-shrink: 0; }
.flow-step.active .step-num { border-color: rgba(168,85,247,.4); color: #a855f7; }
.flow-step.done .step-num { background: rgba(34,197,94,.15); border-color: rgba(34,197,94,.4); color: #22c55e; }
.step-body { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }
.step-title { font-size: 13px; font-weight: 600; color: #94a3b8; }
.step-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; word-break: break-all; }
.step-waiting { font-size: 12px; color: #334155; }
.code-pill { font-size: 13px; color: #a855f7; background: rgba(168,85,247,.1); border: 1px solid rgba(168,85,247,.2); border-radius: 6px; padding: 4px 10px; display: inline-block; }
.flow-actions { display: flex; gap: 10px; margin-top: 20px; }
.running-hint { font-size: 13px; color: #64748b; padding: 9px 0; }

@media(max-width:680px){.columns{grid-template-columns:1fr}}
</style>
