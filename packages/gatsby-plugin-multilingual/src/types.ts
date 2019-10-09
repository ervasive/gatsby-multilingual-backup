import {
  PluginOptions as GatsbyPluginOptions,
  WrapRootElementBrowserArgs,
} from 'gatsby'
import i18next from 'i18next'
import { GatsbyPage, GatsbyRedirect } from '@gatsby-plugin-multilingual/shared'

export type PagesRegistry = Record<string, Record<string, string>>

export enum Mode {
  Greedy = 'greedy',
  Lazy = 'lazy',
}

export enum MissingLanguages {
  Ignore = 'ignore',
  Generate = 'generate',
  Redirect = 'redirect',
}

export type Language = {
  language: string
  path?: string
}

export enum StrictCheckType {
  Ignore = 'ignore',
  Warn = 'warn',
  Error = 'error',
}

export interface MultilingualProperty {
  pageId: string
  languages?: (Language | string)[]
  missingLanguages?: MissingLanguages
}

export interface MultilingualOverride extends MultilingualProperty {
  shouldBeProcessed?: boolean
}

export interface Options extends GatsbyPluginOptions {
  defaultLanguage: string
  availableLanguages: string[]
  defaultNamespace: string
  mode: Mode
  missingLanguages: MissingLanguages
  includeDefaultLanguageInURL: boolean
  overrides:
    | ((page: GatsbyPage) => MultilingualOverride | never)
    | MultilingualOverride[]
  strictChecks: {
    paths: StrictCheckType
    pages: StrictCheckType
    translations: StrictCheckType
  }
  pathToRedirectTemplate?: string
}

export interface MultilingualPage extends GatsbyPage {
  context: {
    multilingual?: boolean | MultilingualProperty
  }
}

export interface MonolingualPage extends GatsbyPage {
  context: {
    pageId: string
    language: string
  }
}

export interface RedirectPage extends GatsbyPage {
  context: {
    redirectTo: string
  }
}

export interface PagesGeneratorResult {
  pages: (MonolingualPage | RedirectPage)[]
  redirects: GatsbyRedirect[]
  errors: {
    type: string
    message: string
  }[]
  removeOriginalPage?: boolean
}

export type ContextProviderData = Pick<
  Options,
  | 'defaultLanguage'
  | 'availableLanguages'
  | 'defaultNamespace'
  | 'includeDefaultLanguageInURL'
> & {
  currentLanguage: string
  getPath: (
    value?:
      | string
      | {
          path?: string
          language?: string
          generic?: boolean
          strict?: StrictCheckType
        },
  ) => string | never // This function throws in certain cases
  getLanguages: (
    value?:
      | string
      | {
          path?: string
          skipCurrentLanguage?: boolean
          strict?: StrictCheckType
        },
  ) => { language: string; path: string; isCurrent: boolean }[] | never // This function throws in certain cases
}

export interface WrapRootElementProps {
  args: WrapRootElementBrowserArgs
  pluginOptions: Options
  translations: i18next.Resource
  namespaces: string[]
}

export interface WrapPageElementArgs {
  element: object
  props: {
    path: string
    pageContext: Partial<MonolingualPage['context']>
  }
}

export interface WrapPageElementProps {
  args: WrapPageElementArgs
  pluginOptions: Options
  pages: PagesRegistry
}
