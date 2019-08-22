import createI18Instance from './i18n'
import getOptions from './get-options'
import { WrapRootElementProps } from './types'

const WrapRootElement = ({
  args: { element },
  pluginOptions,
  translations,
  namespaces,
}: WrapRootElementProps): JSX.Element => {
  const { defaultLanguage, availableLanguages, defaultNamespace } = getOptions(
    pluginOptions,
  )

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
