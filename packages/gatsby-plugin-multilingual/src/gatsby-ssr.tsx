import React from 'react'
import getOptions from './get-options'
import RootWrapper from './components/MultilingualRootWrapper'
import PageWrapper from './components/MultilingualPageWrapper'
import {
  TranslationsBundling,
  OnRenderBody,
  WrapRootElement,
  WrapPageElement,
} from './types'

// These modules are generated on "preBootstrap" lifecycle method and available
// via webpack alias entries
import namespaces from 'namespaces'
import translations from 'translations'
import pagesRegistry from 'pages-registry'
import pathnamesRegistry from 'pathnames-registry'

export const onRenderBody: OnRenderBody = (
  { setHeadComponents, pathname },
  pluginOptions,
): void => {
  // We are not bundling any translations in development mode because
  // "onRenderBody" does not receive the "pathname" value, so we are not able
  // to determine the page language
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const { translationsBundling } = getOptions(pluginOptions)

  const languageKey = pathnamesRegistry[pathname]
  const pageLanguage = translations[languageKey] ? languageKey : undefined
  const output = []

  if (!pageLanguage) {
    return
  }

  output.push(`language: "${pageLanguage}"`)

  if (translationsBundling === TranslationsBundling.All) {
    output.push(`translations: ${JSON.stringify(translations)}`)
  }

  if (translationsBundling === TranslationsBundling.PageLanguage) {
    output.push(
      `translations: ${JSON.stringify({
        [pageLanguage]: translations[pageLanguage] || {},
      })}`,
    )
  }

  setHeadComponents([
    <script
      key="bundled-translations"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `window.gpml = {${output.join(',')}}`,
      }}
    />,
  ])
}

export const wrapRootElement: WrapRootElement = (
  { element },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  return (
    <RootWrapper
      pageLanguage={options.defaultLanguage}
      namespaces={namespaces}
      translations={translations}
      options={options}
    >
      {element}
    </RootWrapper>
  )
}

export const wrapPageElement: WrapPageElement = (
  { element, props: { path, pageContext } },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  const pageId = pageContext.pageId || path
  const language = pageContext.language || options.defaultLanguage

  return (
    <PageWrapper
      pageId={pageId}
      pageLanguage={language}
      pages={pagesRegistry}
      options={options}
    >
      {element}
    </PageWrapper>
  )
}
