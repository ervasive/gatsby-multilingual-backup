import {
  Node as GatsbyNode,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'

export interface GatsbyPage extends GatsbyNode {
  path: string
  component: string
  isCreatedByStatefulCreatePages: boolean
  context: {
    [key: string]: unknown
  }
}

export interface LingualPage extends GatsbyPage {
  context: {
    lingual: boolean
    language: string
    genericPath: string
  }
}

export interface GatsbyStorePlugin {
  name: string
  pluginOptions: GatsbyPluginOptions
}

export interface NamespaceNode extends GatsbyNode {
  language: string
  namespace: string
  priority: number
  data: string
}
