import { useSyncExternalStore } from 'react'
import { translations, type Locale } from '../i18n/translations'

const STORAGE_KEY = 'jonas.dev.locale'

function readInitial(): Locale {
  if (typeof window === 'undefined') return 'en'
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'sv' ? 'sv' : 'en'
}

let currentLocale: Locale = readInitial()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(l => l())
}

export function setLocale(next: Locale) {
  if (next === currentLocale) return
  currentLocale = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next)
    document.cookie = STORAGE_KEY + '=' + next + '; path=/; max-age=31536000; SameSite=Lax'
  }
  emit()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'sv') && e.newValue !== currentLocale) {
      currentLocale = e.newValue
      emit()
    }
  })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, () => currentLocale, () => 'en' as Locale)
  return {
    locale,
    setLocale,
    t: translations[locale],
  }
}
