import { ref, watch } from 'vue'

export type Locale = 'en' | 'sv'

export const STORAGE_KEY = 'jonas.dev.locale'

function readInitial(): Locale {
  if (typeof window === 'undefined') return 'en'
  const cookie = document.cookie.split('; ').find(c => c.startsWith(STORAGE_KEY + '='))
  const fromCookie = cookie ? cookie.slice(STORAGE_KEY.length + 1) : null
  const fromStorage = window.localStorage.getItem(STORAGE_KEY)
  const v = fromStorage ?? fromCookie
  return v === 'sv' ? 'sv' : 'en'
}

export const locale = ref<Locale>(readInitial())

if (typeof window !== 'undefined') {
  watch(locale, (v) => {
    window.localStorage.setItem(STORAGE_KEY, v)
    document.cookie = STORAGE_KEY + '=' + v + '; path=/; max-age=31536000; SameSite=Lax'
  })

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'sv')) {
      locale.value = e.newValue
    }
  })
}
