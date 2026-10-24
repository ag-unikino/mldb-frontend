import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'

export const SUPPORTED_LOCALES = ['de', 'en'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

const STORAGE_KEY = 'locale'

function isAppLocale(value: unknown): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale)
}

function getInitialLocale(): AppLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isAppLocale(stored)) return stored
  } catch {
    // storage can be unavailable, the browser language is used instead
  }
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'de'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { de, en },
})

document.documentElement.lang = i18n.global.locale.value

export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // not being able to remember the choice is acceptable
  }
}

export default i18n
