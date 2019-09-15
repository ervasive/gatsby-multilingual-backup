import React from 'react'
import i18next from 'i18next'
import getOptions from './get-options'
import createGetPath from './create-get-path'
import createGetLanguages from './create-get-languages'
import { MultilingualContext } from './MultilingualContext'
import { WrapPageElementProps } from './types'

const WrapPageElement = ({
  args: { element, props },
  pluginOptions,
  pages,
}: WrapPageElementProps): JSX.Element => {
  const {
    defaultLanguage,
    availableLanguages,
    defaultNamespace,
    includeDefaultLanguageInURL,
    strictPathChecks,
  } = getOptions(pluginOptions)

  const { language, genericPath } = props.pageContext

  i18next.changeLanguage(language || defaultLanguage)

  return (
    <MultilingualContext.Provider
      value={{
        defaultLanguage,
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
