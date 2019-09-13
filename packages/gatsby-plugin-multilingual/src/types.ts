import {
  PluginOptions as GatsbyPluginOptions,
  WrapRootElementBrowserArgs,
} from 'gatsby'
import i18next from 'i18next'
import { NavigateOptions } from '@reach/router'
import { GatsbyPage, GatsbyRedirect } from '@gatsby-plugin-multilingual/shared'
import createLink from 'create-link'

export interface PluginOptions extends GatsbyPluginOptions {
  defaultLanguage?: any
  availableLanguages?: any
  defaultNamespace?: any
  includeDefaultLanguageInURL?: any
  strictPathChecks?: any
  removeInvalidPages?: any
  removeSkippedPages?: any
  pathToRedirectTemplate?: any
  customSlugs?: any
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
  strictPathChecks: boolean
  removeInvalidPages: boolean
  removeSkippedPages: boolean
  pathToRedirectTemplate?: string
  customSlugs: Record<string, Record<string, string>>
  defaultTranslationsLoader: {
    disable: boolean
    path: string
    priority: number
  }
}

export interface MultilingualContextLanguage {
  language: string
  slug?: string
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
  error?: {
    type: string
    message: string
  }
  removeOriginalPage?: boolean
}

export type PagesRegistry = Record<string, Record<string, string>>

export type ContextProviderData = Pick<
  PluginValidatedOptions,
  | 'defaultLanguage'
  | 'availableLanguages'
  | 'defaultNamespace'
  | 'includeDefaultLanguageInURL'
> & {
  getPagePath: (value?: unknown) => Error | string
  navigate: (value?: unknown, options?: NavigateOptions<{}>) => Error | void
  Link: ReturnType<typeof createLink>
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
    pageContext: MonolingualPage['context']
  }
}

export interface WrapPageElementProps {
  args: WrapPageElementArgs
  pluginOptions: PluginOptions
  pages: PagesRegistry
}
