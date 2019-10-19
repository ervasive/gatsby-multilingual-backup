import {
  PluginOptions as GatsbyPluginOptions,
  RenderBodyArgs as GatsbyRenderBodyArgs,
} from 'gatsby'
import i18next, { Resource, i18n } from 'i18next'
import {
  GatsbyPage,
  GatsbyRedirect,
  NamespaceNode,
} from '@gatsby-plugin-multilingual/shared'

declare global {
  interface Window {
    gpml?: {
      language?: string
      translations?: TranslationsResource
    }
  }
}

export type PagesRegistry = Record<string, Record<string, string>>
export type PathnamesRegistry = Record<string, string>
export type TranslationsResource = Resource

export enum Mode {
  Greedy = 'greedy',
  Lazy = 'lazy',
}

export enum MissingLanguages {
  Ignore = 'ignore',
  Generate = 'generate',
  Redirect = 'redirect',
}

export enum CheckType {
  Ignore = 'ignore',
  Warn = 'warn',
  Error = 'error',
}

export enum TranslationsBundling {
  All = 'all',
  None = 'none',
  PageLanguage = 'page-language',
}

export type Language = {
  language: string
  path?: string
}

export interface MultilingualContext {
  pageId?: string
  languages?: (Language | string)[]
  missingLanguages?: MissingLanguages
}

export interface MultilingualOverride extends MultilingualContext {
  pageId: string
  shouldBeProcessed?: boolean
}

export interface Options extends GatsbyPluginOptions {
  defaultLanguage: string
  availableLanguages: string[]
  defaultNamespace: string
  includeDefaultLanguageInURL: boolean
  mode: Mode
  missingLanguages: MissingLanguages
  translationsBundling: TranslationsBundling
  pathToRedirectTemplate?: string
  overrides:
    | ((page: GatsbyPage) => MultilingualOverride | never)
    | MultilingualOverride[]
  checks: {
    missingPaths: CheckType
    missingLanguageVersions: CheckType
    missingTranslationStrings: CheckType
  }
}

export interface MultilingualPage extends GatsbyPage {
  context: {
    multilingual?: boolean | MultilingualContext
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

export type GetPathHelper = (
  value?:
    | string
    | {
        path?: string
        language?: string
        generic?: boolean
        onMissingPath?: CheckType
      },
) => string | never // This function throws in certain cases

export type GetLanguagesHelper = (
  value?:
    | string
    | {
        path?: string
        skipCurrentLanguage?: boolean
        onMissingPath?: CheckType
      },
) => { language: string; path: string; isCurrent: boolean }[] | never // This function throws in certain cases

export type ContextProviderData = Pick<
  Options,
  | 'defaultLanguage'
  | 'availableLanguages'
  | 'defaultNamespace'
  | 'includeDefaultLanguageInURL'
> & {
  currentLanguage: string
  getPath: GetPathHelper
  getLanguages: GetLanguagesHelper
}

export interface PagesGeneratorResult {
  pages: (MonolingualPage | RedirectPage)[]
  redirects: GatsbyRedirect[]
  errors: string[]
  removeOriginalPage?: boolean
}

export type TranslationsAggregatorResult = (
  nodes: NamespaceNode[],
  options: Options,
) => {
  namespaces: Set<string>
  translations: TranslationsResource
}

export type CreateI18nInstance = (args: {
  pageLanguage: string
  defaultLanguage: string
  availableLanguages: string[]
  namespace: string
  availableNamespaces: string[]
  translations: Resource
}) => i18n

export type OnRenderBody = (
  args: GatsbyRenderBodyArgs,
  pluginOptions: GatsbyPluginOptions,
) => void

export type WrapRootElement = (
  args: { element: JSX.Element },
  pluginOptions: Partial<Options>,
) => JSX.Element

export type RootElement = (args: {
  pageLanguage: string
  namespaces: string[]
  translations: i18next.Resource
  options: Options
  children: JSX.Element
}) => JSX.Element

export type WrapPageElement = (
  args: {
    element: JSX.Element
    props: {
      path: string
      pageContext: Partial<MonolingualPage['context']>
      [key: string]: unknown
    }
  },
  pluginOptions: Partial<Options>,
) => JSX.Element

export type PageElement = (args: {
  pageId: string
  pageLanguage: string
  pages: PagesRegistry
  options: Options
  children: JSX.Element
}) => JSX.Element
