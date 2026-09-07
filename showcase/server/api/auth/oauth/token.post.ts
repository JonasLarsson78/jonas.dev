import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'demo-secret-not-for-prod')

export default defineEventHandler(async (event) => {
  const { grant_type } = await readBody(event) as Record<string, string>
  if (grant_type !== 'authorization_code') throw createError({ statusCode: 400, message: 'Only authorization_code grant_type supported' })

  const accessToken = await new SignJWT({ name: 'Jonas Larsson', email: 'jonas@demo.com', role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('u1')
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(SECRET)

  const refreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('u1')
    .setExpirationTime('7d')
    .sign(SECRET)

  return { token_type: 'Bearer', accessToken, refreshToken, expiresIn: 900 }
})
