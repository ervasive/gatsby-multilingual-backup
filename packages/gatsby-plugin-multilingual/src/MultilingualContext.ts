import React from 'react'
import getOptions from './get-options'
import createLink from './create-link'
import createNavigate from './create-navigate'
import createGetPagePath from './create-get-page-path'
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
  getPagePath: createGetPagePath({}, '', false),
  navigate: createNavigate({}, '', false),
  Link: createLink({}, '', false),
})
