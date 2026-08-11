import { createI18n } from 'vue-i18n';
import storage from 'store';
import zhCN from './zh-CN/';
import enUs from './en-US/'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUs
};

const i18n = createI18n({
  locale: storage.get('select-lang-value') || 'zh-CN',
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages
});


// 初始化 i18n 实例并导出
export default i18n