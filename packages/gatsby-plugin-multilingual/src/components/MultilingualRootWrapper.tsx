import createI18Instance from '../create-i18n-instance'
import { RootElement } from '../types'

const MultilingualRootWrapper: RootElement = ({
  pageLanguage,
  namespaces,
  translations,
  children,
  options: { defaultLanguage, availableLanguages, defaultNamespace },
}) => {
  createI18Instance({
    pageLanguage,
    defaultLanguage,
    availableLanguages,
    namespace: defaultNamespace,
    availableNamespaces: namespaces,
    translations,
  })

  return children
}

export default MultilingualRootWrapper
