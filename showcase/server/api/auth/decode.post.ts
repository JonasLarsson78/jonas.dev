import { decodeJwt, decodeProtectedHeader } from 'jose'

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event) as { token?: string }
  if (!token) throw createError({ statusCode: 400, message: 'token required' })

  try {
    const header  = decodeProtectedHeader(token)
    const payload = decodeJwt(token)
    return { decoded: { header, payload } }
  } catch {
    throw createError({ statusCode: 400, message: 'Cannot decode token' })
  }
})
