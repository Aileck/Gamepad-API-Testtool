import { createI18n } from 'vue-i18n'
import en from '../../../locales/en'
import es from '../../../locales/es'
import zh from '../../../locales/zh'

const i18n = createI18n({
  legacy: false, // Enable Composition API mode
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    es
  }
})

export default i18n