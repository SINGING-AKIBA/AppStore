import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import msMY from './ms-MY'

/**
 * 获取浏览器 / 系统首选语言
 * 支持顺序：URL 参数 ?lang= → navigator.language → 默认 zh-CN
 */
function detectLocale(): string {
  // #ifdef H5
  try {
    const params = new URLSearchParams(window.location.search)
    const langParam = params.get('lang')
    if (langParam) {
      if (langParam.startsWith('ms')) return 'ms-MY'
      if (langParam.startsWith('en')) return 'en-US'
      return 'zh-CN'
    }
  } catch { /* ignore */ }

  try {
    const navLang = navigator.language || (navigator as any).userLanguage || ''
    if (navLang.startsWith('ms')) return 'ms-MY'
    if (navLang.startsWith('en')) return 'en-US'
  } catch { /* ignore */ }
  // #endif

  // #ifdef APP-PLUS
  try {
    const osLang = plus.os?.language || ''
    if (osLang.startsWith('ms')) return 'ms-MY'
    if (osLang.startsWith('en')) return 'en-US'
  } catch { /* ignore */ }
  // #endif

  return 'zh-CN'
}

const i18n = createI18n({
  locale: detectLocale(),
  fallbackLocale: 'zh-CN',
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 允许在模板中直接使用 $t
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ms-MY': msMY,
  },
})

export default i18n

/** 获取当前语言标识 */
export function getCurrentLocale(): string {
  return i18n.global.locale.value
}

/** 切换语言 */
export function setLocale(locale: string) {
  i18n.global.locale.value = locale
}