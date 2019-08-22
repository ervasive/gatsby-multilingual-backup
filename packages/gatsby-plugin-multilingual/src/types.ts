import {
  PluginOptions as GatsbyPluginOptions,
  WrapRootElementBrowserArgs,
} from 'gatsby'
import i18next from 'i18next'
import { LingualPage } from '@gatsby-plugin-multilingual/shared'

export interface PluginOptions extends GatsbyPluginOptions {
  defaultLanguage?: any
  availableLanguages?: any
  defaultNamespace?: any
  includeDefaultLanguageInURL?: any
  defaultTranslationsLoader?: {
    disable?: any
    path?: any
    priority?: any
  }
}

export interface PluginValidatedOptions extends GatsbyPluginOptions {
  defaultLanguage: string
  availableLanguages: string[]
  defaultNamespace: string
  includeDefaultLanguageInURL: boolean
  defaultTranslationsLoader: {
    disable: boolean
    path: string
    priority: number
  }
}

export type PagesRegistry = Record<string, Record<string, string>>

export type MLContextProviderData = Pick<
  PluginValidatedOptions,
  | 'defaultLanguage'
  | 'availableLanguages'
  | 'defaultNamespace'
  | 'includeDefaultLanguageInURL'
> & {
  pages: PagesRegistry
}

export interface WrapRootElementProps {
  args: WrapRootElementBrowserArgs
  pluginOptions: PluginOptions
  translations: i18next.Resource
  namespaces: string[]
}

export interface WrapPageElementArgs {
  element: object
  props: {
    pageContext: LingualPage['context']
  }
}

export interface WrapPageElementProps {
  args: WrapPageElementArgs
  pluginOptions: PluginOptions
  pages: PagesRegistry
}
