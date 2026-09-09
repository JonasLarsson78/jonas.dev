import { computed } from 'vue'
import { locale } from '../../../_shared/vue/locale'
import { translations } from '../i18n/translations'

const t = computed(() => translations[locale.value])

export function useLocale() {
  return { locale, t }
}

