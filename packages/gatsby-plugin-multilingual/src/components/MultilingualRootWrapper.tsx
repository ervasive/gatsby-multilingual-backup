import React, { useLayoutEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import createI18Instance from '../i18n'
import { RootElement } from '../types'

const MultilingualRootWrapper: RootElement = ({
  namespaces,
  translations,
  options: { defaultLanguage, availableLanguages, defaultNamespace },
  children,
}) => {
  const i18n = createI18Instance({
    language: defaultLanguage,
    availableLanguages,
    namespace: defaultNamespace,
    namespaces,
    translations,
  })

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export default MultilingualRootWrapper
