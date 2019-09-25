import {
  PluginOptions as GatsbyPluginOptions,
  WrapRootElementBrowserArgs,
} from 'gatsby'
import i18next from 'i18next'
import { GatsbyPage, GatsbyRedirect } from '@gatsby-plugin-multilingual/shared'

export type PagesRegistry = Record<string, Record<string, string>>

export interface Options extends GatsbyPluginOptions {
  defaultLanguage: string
  availableLanguages: string[]
  defaultNamespace: string
  includeDefaultLanguageInURL: boolean
  strictPathChecks: boolean
  removeInvalidPages: boolean
  removeSkippedPages: boolean
  pathToRedirectTemplate?: string
  pathOverrides: PagesRegistry
}

export interface MultilingualContextLanguage {
  language: string
  path?: string
}

export interface MultilingualPage extends GatsbyPage {
  context: {
    multilingual: {
      languages: (MultilingualContextLanguage | string)[]
      skip?: boolean
    }
  }
}

export interface MonolingualPage extends GatsbyPage {
  context: {
    language: string
    genericPath: string
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
    value:
      | string
      | {
          path: string
          language?: string
          generic?: boolean
          strict?: boolean
        },
  ) => Error | string
  getLanguages: (
    value?:
      | string
      | {
          path?: string
          skipCurrentLanguage?: boolean
          strict?: boolean
        },
  ) => Error | { language: string; path: string; isCurrent: boolean }[]
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
