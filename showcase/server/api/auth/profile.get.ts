import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'demo-secret-not-for-prod')

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) throw createError({ statusCode: 401, message: 'Authorization header required: Bearer <token>' })

  try {
    const { payload } = await jwtVerify(auth.slice(7), SECRET)
    return {
      user: { id: payload.sub, name: payload.name, email: payload.email, role: payload.role },
      tokenMeta: { issuedAt: payload.iat, expiresAt: payload.exp },
    }
  } catch (err: unknown) {
    const msg = err instanceof Error && err.message.includes('expired') ? 'Token expired' : 'Token invalid'
    throw createError({ statusCode: 401, message: msg })
  }
})
