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
    strictPathChecks,
  },
  pages,
}: WrapPageElementProps): JSX.Element => {
  const { language, genericPath } = props.pageContext
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
          pageGenericPath: genericPath || props.path,
          pageLanguage: i18n.language,
          defaultLanguage,
          pageLanguage: i18next.language,
          includeDefaultLanguageInURL,
          strict: strictPathChecks,
        }),
        getLanguages: createGetLanguages({
          pages,
          pageGenericPath: genericPath || props.path,
          pageLanguage: i18n.language,
          defaultLanguage,
          includeDefaultLanguageInURL,
          strict: strictPathChecks,
        }),
      }}
    >
      {element}
    </MultilingualContext.Provider>
  )
}

export default WrapPageElement
