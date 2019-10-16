import createI18Instance from '../i18n'
import { RootElement } from '../types'

const MultilingualRootWrapper: RootElement = ({
  namespaces,
  translations,
  options: { defaultLanguage, availableLanguages, defaultNamespace },
  children,
}) => {
  createI18Instance({
    language: defaultLanguage,
    availableLanguages,
    namespace: defaultNamespace,
    namespaces,
    translations,
  })

  return children
}

export default MultilingualRootWrapper
