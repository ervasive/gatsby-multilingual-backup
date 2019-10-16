import uniq from 'lodash/uniq'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'

export default ({
  language,
  availableLanguages,
  namespace,
  namespaces,
  translations,
}: {
  language: string
  availableLanguages: string[]
  namespace: string
  namespaces: string[]
  translations?: i18n.Resource
}): i18n.i18n => {
  const i18nInstance = i18n
  const options: i18n.InitOptions = {
    lng: language,
    fallbackLng: language,
    whitelist: uniq([...availableLanguages, language]),
    defaultNS: namespace,
    ns: uniq([...namespaces, namespace]),
    resources: translations,
    preload: availableLanguages,
    partialBundledLanguages: true,

    // debug: true, // TODO: enable if plugin option is true

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true, // TODO: should it be configurable?
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
