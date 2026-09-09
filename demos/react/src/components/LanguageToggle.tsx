import { useLocale, setLocale } from '../hooks/useLocale'

export function LanguageToggle() {
  const { locale } = useLocale()

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={locale === 'en' ? 'active' : ''}
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >EN</button>
      <button
        type="button"
        className={locale === 'sv' ? 'active' : ''}
        aria-pressed={locale === 'sv'}
        onClick={() => setLocale('sv')}
      >SV</button>
    </div>
  )
}
