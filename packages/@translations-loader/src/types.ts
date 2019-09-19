import { PluginOptions as GatsbyPluginOptions } from 'gatsby'
import { GatsbyStorePlugin } from '@gatsby-plugin-multilingual/shared'

export type Options = GatsbyPluginOptions & {
  path: string
  priority: number
  transformers: Transformer[]
}

export interface Transformer {
  type: string
  handler: (content: string) => string | Error
}

export interface StorePluginLoader extends GatsbyStorePlugin {
  pluginOptions: GatsbyPluginOptions & Options
}
