export default defineEventHandler((event) => {
  const { client_id, redirect_uri, state } = getQuery(event) as Record<string, string>
  if (!client_id || !redirect_uri) throw createError({ statusCode: 400, message: 'client_id and redirect_uri required' })

  const code = Math.random().toString(36).slice(2, 12)
  const redirectUrl = new URL(redirect_uri)
  redirectUrl.searchParams.set('code', code)
  if (state) redirectUrl.searchParams.set('state', state)

  return { message: 'Authorization granted (demo — auto-approved)', code, redirectUrl: redirectUrl.toString(), expiresIn: 60 }
})
