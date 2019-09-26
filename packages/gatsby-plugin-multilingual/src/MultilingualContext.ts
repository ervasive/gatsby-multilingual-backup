import React from 'react'
import { DEFAULT_OPTIONS } from './constants'
import { ContextProviderData } from './types'

const {
  defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
} = DEFAULT_OPTIONS

export const MultilingualContext = React.createContext<ContextProviderData>({
  defaultLanguage,
  currentLanguage: defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
  getPath: path => String(path),
  getLanguages: () => [],
})
