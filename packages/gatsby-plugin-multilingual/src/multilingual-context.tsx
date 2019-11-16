import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { createGetPath, createGetLanguages } from './helpers'
import { getOptions } from './utils'
import { ContextData, ContextProvider } from './types'
// import { useStaticQuery, graphql } from 'gatsby'

const defaults = getOptions()

const initialValue: ContextData = {
  pageId: '',
  pageLanguage: defaults.defaultLanguage,
  defaultLanguage: defaults.defaultLanguage,
  availableLanguages: defaults.availableLanguages,
  defaultNamespace: defaults.defaultNamespace,
  availalbeNamespaces: [defaults.defaultNamespace],
  includeDefaultLanguageInURL: defaults.includeDefaultLanguageInURL,
  getPath: () => {
    throw new Error('Not initialized')
  },
  getLanguages: () => {
    throw new Error('Not initialized')
  },
}

export const MultilingualContext = React.createContext<ContextData>(
  initialValue,
)

export const MultilingualProvider: ContextProvider = ({
  pageId,
  pageLanguage,
  namespaces,
  pages,
  options,
  children,
}) => {
  const { i18n } = useTranslation()
  // const result = useStaticQuery(`query {allSitePage {
  //   nodes {
  //     path
  //     context {
  //       multilingualId
  //       language
  //     }
  //   }
  // }}`)

  // console.log('result', result)

  if (pageLanguage !== i18n.language) {
    i18n.changeLanguage(pageLanguage)
  }
  console.log('MultilingualContext')

  return (
    <MultilingualContext.Provider
      value={{
        pageId,
        pageLanguage,
        defaultLanguage: options.defaultLanguage,
        availableLanguages: options.availableLanguages,
        defaultNamespace: options.defaultNamespace,
        availalbeNamespaces: namespaces,
        includeDefaultLanguageInURL: options.includeDefaultLanguageInURL,
        getPath: createGetPath({
          currentPageId: pageId,
          currentPageLanguage: pageLanguage,
          pages,
          options,
        }),
        getLanguages: createGetLanguages({
          currentPageId: pageId,
          currentPageLanguage: pageLanguage,
          pages,
          options,
        }),
      }}
    >
      {children}
    </MultilingualContext.Provider>
  )
}

export const MultilingualConsumer = MultilingualContext.Consumer

export const useMultilingual = (): ContextData => {
  return useContext<ContextData>(MultilingualContext)
}
