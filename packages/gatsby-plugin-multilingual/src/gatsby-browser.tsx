import React, { Suspense } from 'react'

import getOptions from './get-options'
import { WrapRootElement, WrapPageElement } from './types'

import Root from './components/MultilingualRootWrapper'
import Page from './components/MultilingualPageWrapper'

// These modules are generated on "preBootstrap" method and available via
// webpack alias entries
import translations from 'translations-default'
import namespaces from 'namespaces'
import pages from 'pages'

// Add "all-translations" module to the webpack's dependencies graph for live
// page reaload on translations change in development
if (process.env.NODE_ENV === 'development') {
  require('translations-all')
}

export const wrapRootElement: WrapRootElement = (
  { element },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)

  console.log('wrapRootElement')

  return (
    <Root namespaces={namespaces} translations={translations} options={options}>
      {element}
    </Root>
  )
}

export const wrapPageElement: WrapPageElement = (
  { element, props: { path, pageContext } },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)
  const pageId = pageContext.pageId || path
  const language = pageContext.language || options.defaultLanguage

  console.log('wrapPageElement')

  return (
    <Suspense fallback={'Loading...'}>
      <Page pageId={pageId} language={language} pages={pages} options={options}>
        {element}
      </Page>
    </Suspense>
  )
}
