import { jwtVerify, SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'demo-secret-not-for-prod')

export default defineEventHandler(async (event) => {
  const { refreshToken } = await readBody(event) as { refreshToken?: string }
  if (!refreshToken) throw createError({ statusCode: 401, message: 'refreshToken required' })

  try {
    const { payload } = await jwtVerify(refreshToken, SECRET)
    const newAccess = await new SignJWT({ name: 'Jonas Larsson', email: 'jonas@demo.com', role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.sub!)
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(SECRET)

    const newRefresh = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.sub!)
      .setExpirationTime('7d')
      .sign(SECRET)

    return { accessToken: newAccess, refreshToken: newRefresh, expiresIn: 900 }
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid or expired refresh token' })
  }
})
