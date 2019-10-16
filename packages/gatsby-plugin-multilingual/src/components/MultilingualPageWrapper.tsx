import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import createGetPath from '../create-get-path'
import createGetLanguages from '../create-get-languages'
import { MultilingualContext } from '../MultilingualContext'
import { PageElement } from '../types'

const MultilingualPageWrapper: PageElement = ({
  pageId,
  language,
  pages,
  options: {
    defaultLanguage,
    availableLanguages,
    defaultNamespace,
    includeDefaultLanguageInURL,
    checks,
  },
  children,
}) => {
  const { i18n } = useTranslation()
  console.log('MultilingualPageWrapper')
  i18n.changeLanguage(language)
  // useEffect(() => {
  // }, [language])

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
