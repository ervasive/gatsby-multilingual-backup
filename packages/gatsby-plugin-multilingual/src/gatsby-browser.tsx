import React, { Suspense } from 'react'
import getOptions from './get-options'
import RootWrapper from './components/MultilingualRootWrapper'
import PageWrapper from './components/MultilingualPageWrapper'
import { WrapRootElement, WrapPageElement } from './types'

// These modules are generated on "preBootstrap" lifecycle method and available
// via webpack alias entries
import namespaces from 'namespaces'
import pagesRegistry from 'pages-registry'

// Get translations resource which may be defined in the document's head
// see ./gatsby-ssr.tsx
let translations =
  window.gpml && window.gpml.translations ? window.gpml.translations : {}

// Load all aggregated translations in development mode
if (process.env.NODE_ENV === 'development') {
  translations = require('translations')
}

export const wrapRootElement: WrapRootElement = (
  { element },
  pluginOptions,
) => {
  console.log('wrapRootElement Browser')

  const options = getOptions(pluginOptions)

  // Determine page language which may be defined in the document's head
  // (see ./gatsby-ssr.tsx) or fallback to the default one
  const language =
    window.gpml && window.gpml.language
      ? window.gpml.language
      : options.defaultLanguage

  return (
    <Suspense fallback="Loading suspense...">
      <RootWrapper
        pageLanguage={language}
        namespaces={namespaces}
        translations={translations}
        options={options}
      >
        {element}
      </RootWrapper>
    </Suspense>
  )
}

export const wrapPageElement: WrapPageElement = (
  { element, props: { path, pageContext } },
  pluginOptions,
) => {
  console.log('wrapPageElement Browser')

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
