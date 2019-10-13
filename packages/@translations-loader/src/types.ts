import { PluginOptions as GatsbyPluginOptions } from 'gatsby'

export type Options = GatsbyPluginOptions & {
  path: string
  priority: number
  transformers: Transformer[]
}

export interface Transformer {
  type: string
  handler: (content: string) => string | never // can potentially throw
}
