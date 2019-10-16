import React, { Suspense } from 'react'
import { GatsbyBrowser } from 'gatsby'
import getOptions from './get-options'
import { MonolingualPage } from './types'

import Root from './components/MultilingualRootWrapper'
import Page from './components/MultilingualPageWrapper'

// explain
import translations from 'translations-default'
import namespaces from 'namespaces'
import pages from 'pages'

// explain
if (process.env.NODE_ENV === 'development') {
  require('translations-all')
}

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = (
  { element },
  pluginOptions,
) => {
  // validate a singular run on mounting
  const options = getOptions(pluginOptions)
  console.log('wrapRootElement')
  return (
    <Root namespaces={namespaces} translations={translations} options={options}>
      {element as JSX.Element}
    </Root>
  )
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = (
  { element, props },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)
  const propsRecord = props as Record<string, unknown>
  const context = propsRecord.pageContext as Partial<MonolingualPage['context']>

  const pageId = context.pageId || (propsRecord.path as string)
  const language = context.language || options.defaultLanguage
  console.log('wrapPageElement')
  return (
    <Suspense fallback={'Loading...'}>
      <Page pageId={pageId} language={language} pages={pages} options={options}>
        {element as JSX.Element}
      </Page>
    </Suspense>
  )
}
