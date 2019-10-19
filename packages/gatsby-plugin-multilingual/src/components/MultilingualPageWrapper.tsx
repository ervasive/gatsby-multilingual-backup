import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import createGetPath from '../create-get-path'
import createGetLanguages from '../create-get-languages'
import { MultilingualContext } from '../MultilingualContext'
import { PageElement } from '../types'

const MultilingualPageWrapper: PageElement = ({
  pageId,
  pageLanguage,
  pages,
  children,
  options: {
    defaultLanguage,
    availableLanguages,
    defaultNamespace,
    includeDefaultLanguageInURL,
    checks,
  },
}) => {
  const { i18n } = useTranslation()

  // SSR
  if (typeof window === 'undefined') {
    if (pageLanguage !== i18n.language) {
      i18n.changeLanguage(pageLanguage)
    }
  }

  // CSR
  // useEffect(() => {
  //   if (pageLanguage !== i18n.language) {
  //     i18n.changeLanguage(pageLanguage)
  //   }
  // }, [pageLanguage])

  return (
    <MultilingualContext.Provider
      value={{
        defaultLanguage,
        currentLanguage: i18n.language,
        availableLanguages,
        defaultNamespace,
        includeDefaultLanguageInURL,
        getPath: createGetPath({
          pages,
          pageGenericPath: pageId,
          pageLanguage: i18n.language,
          defaultLanguage,
          includeDefaultLanguageInURL,
          onMissingPaths: checks.missingPaths,
        }),
        getLanguages: createGetLanguages({
          pages,
          pageGenericPath: pageId,
          pageLanguage: i18n.language,
          defaultLanguage,
          includeDefaultLanguageInURL,
          onMissingPaths: checks.missingPaths,
        }),
      }}
    >
      {children}
    </MultilingualContext.Provider>
  )
}

export default MultilingualPageWrapper
