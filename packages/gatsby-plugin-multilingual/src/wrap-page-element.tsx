import React from 'react'
import i18next from 'i18next'
import getOptions from './get-options'
import createNavigate from './create-navigate'
import createLink from './create-link'
import createGetPagePath from './create-get-page-path'
import { MultilingualContext } from './MultilingualContext'
import { WrapPageElementProps } from './types'

const WrapPageElement = ({
  args: {
    element,
    props: { pageContext },
  },
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

  i18next.changeLanguage(pageContext.language)

  return (
    <MultilingualContext.Provider
      value={{
        defaultLanguage,
        availableLanguages,
        defaultNamespace,
        includeDefaultLanguageInURL,
        getPagePath: createGetPagePath(
          pages,
          i18next.language,
          strictPathChecks,
        ),
        navigate: createNavigate(pages, i18next.language, strictPathChecks),
        Link: createLink(pages, i18next.language, strictPathChecks),
      }}
    >
      {element}
    </MultilingualContext.Provider>
  )
}

export default WrapPageElement
