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
  strictPathChecks,
} = DEFAULT_OPTIONS

export const MultilingualContext = React.createContext<ContextProviderData>({
  defaultLanguage,
  currentLanguage: defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
  getPath: createGetPath({
    pages: {},
    pageLanguage: defaultLanguage,
    defaultLanguage,
    includeDefaultLanguageInURL,
    strict: strictPathChecks,
  }),
  getLanguages: createGetLanguages({
    pages: {},
    pageGenericPath: '/',
    pageLanguage: defaultLanguage,
    defaultLanguage,
    includeDefaultLanguageInURL,
    strict: strictPathChecks,
  }),
})
