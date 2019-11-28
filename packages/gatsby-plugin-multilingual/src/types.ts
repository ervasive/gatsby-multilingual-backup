import { PluginOptions as GatsbyPluginOptions } from 'gatsby'
import { Resource, i18n } from 'i18next'
import {
  GatsbyPage,
  GatsbyRedirect,
  NamespaceNode,
} from '@gatsby-plugin-multilingual/shared'

export type PagesRegistry = Record<string, Record<string, string>>
export type NamespacesRegistry = string[]
export type TranslationsResource = Resource
export type GatsbyStorePages = Map<string, GatsbyPage>
export type PageRulesRecord = Record<
  string,
  {
    id: string
    language: string
    slug: string
  }[]
>

export enum MissingLanguagesStrategy {
  Ignore = 'ignore',
  Generate = 'generate',
  Redirect = 'redirect',
}

export enum CheckType {
  Ignore = 'ignore',
  Warn = 'warn',
  Error = 'error',
}

export enum MessageType {
  Info = 'info',
  Warning = 'warn',
  Error = 'error',
  Panic = 'panic',
}

// TODO: consider adding a custom client side component option
// TODO: handle "missingLanguageVersions"
export interface Options extends GatsbyPluginOptions {
  defaultLanguage: string
  availableLanguages: string[]
  defaultNamespace: string
  includeDefaultLanguageInURL: boolean
  missingLanguagesStrategy: MissingLanguagesStrategy
  removeInvalidPages: boolean
  rules: Record<string, Rule>
  checks: {
    missingPaths: CheckType
    missingLanguageVersions: CheckType
    missingTranslationStrings: CheckType
  }
  plugins: unknown[]
}

export interface Rule {
  languages?: { [language: string]: string | { path: string; slug: string } }
  missingLanguagesStrategy?: MissingLanguagesStrategy
  skip?: boolean
}

export interface MultilingualPage extends GatsbyPage {
  context: {
    multilingualId: string
    language: string
  }
}

export type MultilingualGroup = Map<string, MultilingualPage>

export interface MultilingualGroups {
  [id: string]: MultilingualGroup
}

export type PagesProcessingResult = {
  messages: { type: MessageType; message: string }[]
  pagesToDelete: Set<GatsbyPage>
  pagesToCreate: Set<MultilingualPage>
  redirectsToCreate: Set<GatsbyRedirect>
}

export type CreateGetLanguagesHelper = (args: {
  currentPageId: string
  currentPageLanguage: string
  pages: PagesRegistry
  options: Options
}) => GetLanguagesHelper

export type GetLanguagesHelper = (
  value?:
    | string
    | {
        path?: string
        skipCurrentLanguage?: boolean
        onMissingPath?: CheckType
      },
) => { language: string; path: string; isCurrent: boolean }[] | never // This function throws in certain cases

// ------
export type ContextProvider = (args: {
  pageId: string
  pageLanguage: string
  namespaces: NamespacesRegistry
  pages: PagesRegistry
  options: Options
  children: JSX.Element
}) => JSX.Element

export type ContextData = Pick<
  Options,
  | 'defaultLanguage'
  | 'availableLanguages'
  | 'defaultNamespace'
  | 'includeDefaultLanguageInURL'
> & {
  pageId: string
  pageLanguage: string
  availalbeNamespaces: NamespacesRegistry
  getPath: GetPathHelper
  getLanguages: GetLanguagesHelper
}

export type TranslationsAggregatorResult = (
  nodes: NamespaceNode[],
  options: Options,
) => {
  namespaces: Set<string>
  translations: TranslationsResource
}

export type CreateI18nInstance = (args: {
  defaultLanguage: string
  availableLanguages: string[]
  defaultNamespace: string
  availableNamespaces: string[]
  translations: TranslationsResource
}) => i18n

export type WrapRootElement = (
  args: { element: JSX.Element },
  pluginOptions: Partial<Options>,
) => JSX.Element

export type WrapPageElement = (
  args: {
    element: JSX.Element
    props: {
      path: string
      pageContext: Partial<MultilingualPage['context']>
      [key: string]: unknown
    }
  },
  pluginOptions: Partial<Options>,
) => JSX.Element

// adapt
export type CreateGetPathHelper = (args: {
  currentPageId: string
  currentPageLanguage: string
  pages: PagesRegistry
  options: Options
}) => GetPathHelper

export type GetPathHelper = (
  value?:
    | string
    | {
        path?: string
        language?: string
        onMissingPath?: CheckType
      },
) => string | never // This function throws in certain cases
