import i18n, { InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import { CreateI18nInstance } from './types'

const createI18nInstance: CreateI18nInstance = ({
  pageLanguage,
  defaultLanguage,
  availableLanguages,
  namespace,
  availableNamespaces,
  translations,
}) => {
  const i18nInstance = i18n
  const options: InitOptions = {
    lng: pageLanguage,
    fallbackLng: defaultLanguage,
    whitelist: availableLanguages,
    defaultNS: namespace,
    ns: availableNamespaces,
    resources: translations,
    partialBundledLanguages: true,
    preload: [pageLanguage],

    debug: true, // TODO: enable if plugin option is true

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  }

  i18nInstance.use(initReactI18next)

  if (typeof XMLHttpRequest === 'function') {
    i18nInstance.use(XHR)
    options.backend = { loadPath: '/translations/{{lng}}/{{ns}}.json' }
  }

  i18nInstance.init(options)

  return i18nInstance
}

export default createI18nInstance
