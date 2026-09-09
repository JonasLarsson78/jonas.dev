import { LOCALE_STORAGE_KEY, useTranslations, type Locale } from '~/composables/useTranslations'

export default defineNuxtPlugin((nuxtApp) => {
  const { locale } = useTranslations()

  // If a demo has changed the language via localStorage but the cookie
  // wasn't updated, reconcile after mount to avoid hydration mismatch.
  nuxtApp.hook('app:mounted', () => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if ((stored === 'en' || stored === 'sv') && stored !== locale.value) {
      locale.value = stored as Locale
    } else if (locale.value) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale.value)
    }
  })

  // Keep localStorage in sync with the cookie whenever it changes
  watch(locale, (v: Locale | null | undefined) => {
    if (v) window.localStorage.setItem(LOCALE_STORAGE_KEY, v)
  })

  // React to changes made in other tabs / demos
  window.addEventListener('storage', (e) => {
    if (e.key === LOCALE_STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'sv')) {
      locale.value = e.newValue as Locale
    }
  })
})
