import {
  PluginOptions as GatsbyPluginOptions,
  WrapPageElementBrowserArgs,
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

export enum CheckType {
  Ignore = 'ignore',
  Warn = 'warn',
  Error = 'error',
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
  overrides:
    | ((page: GatsbyPage) => MultilingualOverride | never)
    | MultilingualOverride[]
  checks: {
    missingPaths: CheckType
    missingLanguageVersions: CheckType
    missingTranslationStrings: CheckType
  }
  pathToRedirectTemplate?: string
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

export interface PagesGeneratorResult {
  pages: (MonolingualPage | RedirectPage)[]
  redirects: GatsbyRedirect[]
  errors: string[]
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
          onMissingPath?: CheckType
        },
  ) => string | never // This function throws in certain cases
  getLanguages: (
    value?:
      | string
      | {
          path?: string
          skipCurrentLanguage?: boolean
          onMissingPath?: CheckType
        },
  ) => { language: string; path: string; isCurrent: boolean }[] | never // This function throws in certain cases
}

export type RootElement = (args: {
  translations: i18next.Resource
  namespaces: string[]
  options: Options
  children: JSX.Element
}) => JSX.Element

export type PageElement = (args: {
  pageId: string
  language: string
  pages: PagesRegistry
  options: Options
  children: JSX.Element
}) => JSX.Element
