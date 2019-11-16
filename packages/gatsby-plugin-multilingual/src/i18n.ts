import i18next, { InitOptions } from 'i18next'
import { CreateI18nInstance } from './types'

export const createI18nInstance: CreateI18nInstance = ({
  defaultLanguage,
  availableLanguages,
  defaultNamespace,
  availableNamespaces,
  translations,
}) => {
  const i18nInstance = i18next

  const options: InitOptions = {
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    whitelist: availableLanguages,
    defaultNS: defaultNamespace,
    ns: availableNamespaces,
    resources: translations,

    debug: true, // TODO: enable if plugin option is true

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  }

  i18nInstance.init(options)

  return i18nInstance
}
