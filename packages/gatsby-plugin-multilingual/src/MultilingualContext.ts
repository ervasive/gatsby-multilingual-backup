import React from 'react'
import getOptions from './get-options'
import createGetLanguages from './create-get-languages'
import { ContextProviderData } from './types'

const {
  defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
} = getOptions()

export const MultilingualContext = React.createContext<ContextProviderData>({
  defaultLanguage,
  availableLanguages,
  defaultNamespace,
  includeDefaultLanguageInURL,
  getLanguages: createGetLanguages({}, '', '', false),
})
