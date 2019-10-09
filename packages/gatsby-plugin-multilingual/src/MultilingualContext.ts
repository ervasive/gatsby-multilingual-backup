import React from 'react'
import getOptions from './get-options'
import { ContextProviderData } from './types'

const {
  defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
} = getOptions()

export const MultilingualContext = React.createContext<ContextProviderData>({
  defaultLanguage,
  currentLanguage: defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
  getPath: path => String(path),
  getLanguages: () => [],
})
