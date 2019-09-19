import React from 'react'
import merge from 'lodash/merge'
import { GatsbyBrowser } from 'gatsby'
import WrapRootElement from './wrap-root-element'
import WrapPageElement from './wrap-page-element'
import { DEFAULT_OPTIONS } from './constants'
import { WrapPageElementArgs, PagesRegistry } from './types'

import translations from 'translations-all'
import namespaces from 'namespaces'
import pages from 'pages'

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = (
  args,
  pluginOptions,
): JSX.Element => (
  <WrapRootElement
    args={args}
    pluginOptions={merge({}, DEFAULT_OPTIONS, pluginOptions)}
    translations={translations}
    namespaces={namespaces}
  />
)

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = (
  args,
  pluginOptions,
): JSX.Element => (
  <WrapPageElement
    args={(args as unknown) as WrapPageElementArgs}
    pluginOptions={merge({}, DEFAULT_OPTIONS, pluginOptions)}
    pages={(pages as unknown) as PagesRegistry}
  />
)
