import {
  Node as GatsbyNode,
  PluginOptions as GatsbyPluginOptions,
  Actions as GatsbyActions,
} from 'gatsby'

export type GatsbyPage = Parameters<GatsbyActions['createPage']>[0] & {
  context: {
    [key: string]: unknown
  }
}

export type GatsbyRedirect = Parameters<GatsbyActions['createRedirect']>[0]

export interface GatsbyStorePlugin {
  id: string
  name: string
  pluginOptions: GatsbyPluginOptions
}

export interface NamespaceNode extends GatsbyNode {
  language: string
  namespace: string
  priority: number
  data: string
}
