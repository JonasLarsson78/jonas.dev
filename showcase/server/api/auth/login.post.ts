import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'demo-secret-not-for-prod')

const USERS: Record<string, { id: string; name: string; email: string; role: string; password: string }> = {
  'jonas@demo.com': { id: 'u1', name: 'Jonas Larsson', email: 'jonas@demo.com', role: 'admin', password: 'password123' },
  'user@demo.com':  { id: 'u2', name: 'Demo User',     email: 'user@demo.com',  role: 'user',  password: 'password123' },
}

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event) as { email?: string; password?: string }
  if (!email || !password) throw createError({ statusCode: 400, message: 'email and password required' })

  const record = USERS[email]
  if (!record || record.password !== password) throw createError({ statusCode: 401, message: 'Invalid credentials' })

  const { password: _pw, ...user } = record

  const accessToken = await new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(SECRET)

  const refreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setExpirationTime('7d')
    .sign(SECRET)

  return { accessToken, refreshToken, expiresIn: 900, user }
})
