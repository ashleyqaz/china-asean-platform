// 轻量级多语言方案 — 支持: zh / en / fr / es / ru / ar
import zh from '~/locales/zh.json'
import en from '~/locales/en.json'
import fr from '~/locales/fr.json'
import es from '~/locales/es.json'
import ru from '~/locales/ru.json'
import ar from '~/locales/ar.json'

const locales = ['zh', 'en', 'fr', 'es', 'ru', 'ar']
const localeNames = { zh: '简体中文', en: 'English', fr: 'Français', es: 'Español', ru: 'Русский', ar: 'عربي' }
const msgMap = { zh, en, fr, es, ru, ar }

// 全局响应式状态 — useState 确保跨组件共享
export function useI18n() {
  const locale = useState('i18n_locale', () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_locale')
      if (saved && locales.includes(saved)) return saved
    }
    return 'zh'
  })

  const messages = computed(() => msgMap[locale.value] || msgMap['zh'])

  function setLocale(loc) {
    if (!locales.includes(loc)) loc = 'zh'
    locale.value = loc
    if (typeof window !== 'undefined') localStorage.setItem('app_locale', loc)
    if (typeof document !== 'undefined') document.documentElement.lang = loc
  }

  function t(key) {
    if (!key) return ''
    const keys = key.split('.')
    let val = messages.value
    for (const k of keys) {
      if (val == null) break
      val = val[k]
    }
    return val || key
  }

  return { locale, locales, localeNames, setLocale, t, messages }
}
