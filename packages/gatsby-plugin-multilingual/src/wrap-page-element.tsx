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
        getPath: createGetPath(pages, i18next.language, strictPathChecks),
        getLanguages: createGetLanguages(
          pages,
          genericPath || props.path,
          i18next.language,
          strictPathChecks,
        ),
      }}
    >
      {element}
    </MultilingualContext.Provider>
  )
}

export default WrapPageElement
