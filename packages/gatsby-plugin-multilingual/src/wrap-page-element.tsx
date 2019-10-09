import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import createGetPath from './create-get-path'
import createGetLanguages from './create-get-languages'
import { MultilingualContext } from './MultilingualContext'
import { WrapPageElementProps } from './types'

const WrapPageElement = ({
  args: { element, props },
  pluginOptions: {
    defaultLanguage,
    availableLanguages,
    defaultNamespace,
    includeDefaultLanguageInURL,
    strictChecks,
  },
  pages,
}: WrapPageElementProps): JSX.Element => {
  const { language, pageId } = props.pageContext
  const { i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(language || defaultLanguage)
  }, [language])

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
          pageGenericPath: pageId || props.path,
          pageLanguage: i18n.language,
          defaultLanguage,
          includeDefaultLanguageInURL,
          strict: strictChecks.paths,
        }),
        getLanguages: createGetLanguages({
          pages,
          pageGenericPath: pageId || props.path,
          pageLanguage: i18n.language,
          defaultLanguage,
          includeDefaultLanguageInURL,
          strict: strictChecks.paths,
        }),
      }}
    >
      {element}
    </MultilingualContext.Provider>
  )
}

export default WrapPageElement
