import React from 'react'
import i18next from 'i18next'
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

  i18next.changeLanguage(language || defaultLanguage)

  return (
    <MultilingualContext.Provider
      value={{
        defaultLanguage,
        currentLanguage: i18next.language,
        availableLanguages,
        defaultNamespace,
        includeDefaultLanguageInURL,
        getPath: createGetPath({
          pages,
          pageGenericPath: genericPath || props.path,
          defaultLanguage,
          includeDefaultLanguageInURL,
          strict: strictPathChecks,
        }),
        getLanguages: createGetLanguages({
          pages,
          pageGenericPath: genericPath || props.path,
          pageLanguage: i18next.language,
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
