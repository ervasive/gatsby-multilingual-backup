import React from 'react'
import createGetPath from './create-get-path'
import createGetLanguages from './create-get-languages'
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
  getPath: createGetPath({}, '', false),
  getLanguages: createGetLanguages({}, '', '', false),
})
