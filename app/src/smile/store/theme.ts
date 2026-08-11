import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@/utils/storage'
import { themeCssVars } from './theme-vars'

export type ThemeMode = 'dark' | 'light' | 'skeuomorphic' | 'professional'

const THEME_KEY = 'theme'
const DEFAULT_THEME: ThemeMode = 'skeuomorphic'


const useThemeStore = defineStore('theme', () => {
  const cachedTheme = storage.get<ThemeMode>(THEME_KEY, DEFAULT_THEME)
  const currentTheme = ref<ThemeMode>(cachedTheme || DEFAULT_THEME)

  function setTheme(mode: ThemeMode) {
    currentTheme.value = mode
    storage.set(THEME_KEY, mode)
    applyTheme(mode)
  }

  function applyTheme(mode: ThemeMode) {
    // H5 & App (webview 模式): 通过 data-theme 属性切换 CSS 变量
    // #ifdef H5 || APP-PLUS
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode)
    }
    // #endif

    // MP-WEIXIN: 通过 setPageStyle 注入页面级 CSS 变量
    // #ifdef MP-WEIXIN
    const vars = themeCssVars[mode]
    const styleText = Object.entries(vars)
      .map(([key, value]) => `${key}:${value}`)
      .join(';')
    ;(uni as any).setPageStyle({
      style: styleText
    })
    // #endif
  }

  function initTheme() {
    applyTheme(currentTheme.value)
  }

  initTheme()

  return {
    currentTheme,
    setTheme,
    applyTheme
  }
})

export { useThemeStore }
