import React from 'react'
import { getOptions } from './utils'
import { I18nextProvider } from 'react-i18next'
import { createI18nInstance } from './i18n'
import { MultilingualProvider } from './multilingual-context'
import { WrapPageElement, WrapRootElement } from './types'

// These modules are generated on bootstrap and available via webpack alias
// entries
import namespaces from 'namespaces'
import translations from 'translations'
import pagesRegistry from 'pages-registry'

export const wrapRootElement: WrapRootElement = (
  { element },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  const i18nInstance = createI18nInstance({
    defaultLanguage: options.defaultLanguage,
    availableLanguages: options.availableLanguages,
    defaultNamespace: options.defaultNamespace,
    availableNamespaces: namespaces,
    translations: translations,
  })

  return <I18nextProvider i18n={i18nInstance}>{element}</I18nextProvider>
}

export const wrapPageElement: WrapPageElement = (
  { element, props: { path, pageContext } },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)
  const pageId = pageContext.multilingualId || path
  const language = pageContext.language || options.defaultLanguage

  return (
    <MultilingualProvider
      pageId={pageId}
      pageLanguage={language}
      namespaces={namespaces}
      pages={pagesRegistry}
      options={options}
    >
      {element}
    </MultilingualProvider>
  )
}
