import React from 'react'
import i18next from 'i18next'
import { MultilingualContext } from './MultilingualContext'
import getOptions from './get-options'
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
  } = getOptions(pluginOptions)

  if (pageContext.language) {
    i18next.changeLanguage(pageContext.language)
  }

  return (
    <MultilingualContext.Provider
      value={{
        defaultLanguage,
        availableLanguages,
        defaultNamespace,
        includeDefaultLanguageInURL,
        pages,
      }}
    >
      {element}
    </MultilingualContext.Provider>
  )
}

export default WrapPageElement
