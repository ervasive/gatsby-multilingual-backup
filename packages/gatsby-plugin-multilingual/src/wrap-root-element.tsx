import createI18Instance from './i18n'
import { WrapRootElementProps } from './types'

const WrapRootElement = ({
  args: { element },
  pluginOptions: { defaultLanguage, availableLanguages, defaultNamespace },
  translations,
  namespaces,
}: WrapRootElementProps): JSX.Element => {
  createI18Instance({
    language: defaultLanguage,
    availableLanguages,
    namespace: defaultNamespace,
    namespaces,
    translations,
  })

  return element as JSX.Element
}

export default WrapRootElement
