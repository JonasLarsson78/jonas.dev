import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

const JWT_SECRET  = 'demo-secret-key-not-for-production'
const JWT_EXPIRES = '15m'
const REFRESH_EXPIRES = '7d'

interface User { id: string; name: string; email: string; role: 'admin' | 'user' }
interface TokenPayload { sub: string; name: string; email: string; role: string; iat?: number; exp?: number }

const USERS: Record<string, { user: User; password: string }> = {
  'jonas@demo.com': {
    user: { id: 'u1', name: 'Jonas Larsson', email: 'jonas@demo.com', role: 'admin' },
    password: 'password123',
  },
  'user@demo.com': {
    user: { id: 'u2', name: 'Demo User', email: 'user@demo.com', role: 'user' },
    password: 'password123',
  },
}

const refreshTokenStore = new Set<string>()

// OAuth2 authorization codes (in-memory, expire after 60s)
const authCodes = new Map<string, { clientId: string; userId: string; expiresAt: number }>()

function issueTokens(user: User) {
  const payload: TokenPayload = { sub: user.id, name: user.name, email: user.email, role: user.role }
  const accessToken  = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES })
  refreshTokenStore.add(refreshToken)
  return { accessToken, refreshToken, expiresIn: 900 }
}

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })

  const record = USERS[email]
  if (!record || record.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  res.json({ ...issueTokens(record.user), user: record.user })
})

// ── Refresh ───────────────────────────────────────────────────────────────────
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string }
  if (!refreshToken || !refreshTokenStore.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' })
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { sub: string }
    const record = Object.values(USERS).find(u => u.user.id === payload.sub)
    if (!record) return res.status(401).json({ error: 'User not found' })

    refreshTokenStore.delete(refreshToken)
    res.json(issueTokens(record.user))
  } catch {
    return res.status(401).json({ error: 'Token verification failed' })
  }
})

// ── Protected profile ─────────────────────────────────────────────────────────
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required: Bearer <token>' })
  }

  try {
    const token = authHeader.slice(7)
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    res.json({
      user: { id: payload.sub, name: payload.name, email: payload.email, role: payload.role },
      tokenMeta: { issuedAt: payload.iat, expiresAt: payload.exp },
    })
  } catch (err) {
    const message = err instanceof jwt.TokenExpiredError ? 'Token expired' : 'Token invalid'
    res.status(401).json({ error: message })
  }
})

// ── Decode (no verification — show structure) ─────────────────────────────────
router.post('/decode', (req, res) => {
  const { token } = req.body as { token?: string }
  if (!token) return res.status(400).json({ error: 'token required' })

  try {
    const decoded = jwt.decode(token, { complete: true })
    res.json({ decoded })
  } catch {
    res.status(400).json({ error: 'Cannot decode token' })
  }
})

// ── OAuth2: Authorization endpoint ───────────────────────────────────────────
router.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, state } = req.query as Record<string, string>
  if (!client_id || !redirect_uri) {
    return res.status(400).json({ error: 'client_id and redirect_uri required' })
  }

  // In a real OAuth2 server, this would show a login page.
  // We auto-approve for demo purposes.
  const code = Math.random().toString(36).slice(2, 12)
  authCodes.set(code, { clientId: client_id, userId: 'u1', expiresAt: Date.now() + 60_000 })

  const redirectUrl = new URL(redirect_uri)
  redirectUrl.searchParams.set('code', code)
  if (state) redirectUrl.searchParams.set('state', state)

  res.json({
    message: 'Authorization granted (demo — auto-approved)',
    code,
    redirectUrl: redirectUrl.toString(),
    expiresIn: 60,
  })
})

// ── OAuth2: Token endpoint ────────────────────────────────────────────────────
router.post('/oauth/token', (req, res) => {
  const { code, grant_type, client_id } = req.body as Record<string, string>

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'Only authorization_code grant type supported' })
  }

  const entry = authCodes.get(code)
  if (!entry) return res.status(400).json({ error: 'Invalid or expired authorization code' })
  if (entry.clientId !== client_id) return res.status(400).json({ error: 'client_id mismatch' })
  if (Date.now() > entry.expiresAt) {
    authCodes.delete(code)
    return res.status(400).json({ error: 'Authorization code expired' })
  }

  authCodes.delete(code)
  const record = Object.values(USERS).find(u => u.user.id === entry.userId)!
  res.json({ token_type: 'Bearer', ...issueTokens(record.user) })
})

export default router
