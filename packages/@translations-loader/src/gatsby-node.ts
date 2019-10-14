import path from 'path'
import { ensureDir } from 'fs-extra'
import { GatsbyNode } from 'gatsby'
import {
  NAMESPACE_NODE_TYPENAME,
  NamespaceNode,
} from '@gatsby-plugin-multilingual/shared'
import getOptions from './get-options'
import transformNodeContent from './transform-node-content'
import getNodePriority from './get-node-priority'
import validateInstanceUniqueness from './validate-instance-uniqueness'
import { PLUGIN_NAME, SOURCE_FILESYSTEM_INSTANCE_NAME } from './constants'

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = async (
  { store, reporter },
  pluginOptions,
): Promise<void> => {
  const options = getOptions(pluginOptions)

  // Validate that there is only a single plugin instance registered for the
  // same translations directory path
  validateInstanceUniqueness(
    options.path,
    store.getState().flattenedPlugins,
  ).mapErr(err => reporter.panic(err))

  // Attempt to create specified directory for translations files
  try {
    await ensureDir(options.path)
  } catch (err) {
    reporter.error(
      `[${PLUGIN_NAME}] there was a problem creating specified translations ` +
        `directory: "${path.resolve(options.path)}"`,
      err,
    )
  }
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  {
    node,
    actions: { createNode, createParentChildLink },
    store,
    reporter,
    createNodeId,
    createContentDigest,
    loadNodeContent,
  },
  pluginOptions,
): Promise<void> => {
  const { path: translationsPath, priority, transformers } = getOptions(
    pluginOptions,
  )

  // Continue only if we have an appropriate "node" type
  if (node.sourceInstanceName !== SOURCE_FILESYSTEM_INSTANCE_NAME) {
    return
  }

  // Check if the "node" belongs to the current plugin "instance" by comparing
  // its parent directory path to the provided "options.path" value
  if (path.parse(node.dir as string).dir !== path.resolve(translationsPath)) {
    return
  }

  // Get "language" and "namespace" values from the node's relative path
  const { dir: language, name: namespace } = path.parse(
    node.relativePath as string,
  )

  // Transform the source node's content and if successful create new
  // NamespaceNode node
  transformNodeContent(
    await loadNodeContent(node),
    node.absolutePath as string,
    node.internal.mediaType,
    transformers,
  ).map(result => {
    result
      .map(content => {
        const namespaceNode: NamespaceNode = {
          id: createNodeId(`${node.id}-${SOURCE_FILESYSTEM_INSTANCE_NAME}`),
          parent: node.id,
          children: [],
          internal: {
            type: NAMESPACE_NODE_TYPENAME,
            mediaType: '​​application/json',
            contentDigest: createContentDigest(content),
            owner: '',
          },
          language,
          namespace,
          priority: getNodePriority(
            translationsPath,
            priority,
            store.getState().flattenedPlugins,
          ),
          data: content,
        }

        createNode(namespaceNode)
        createParentChildLink({ parent: node, child: namespaceNode })
      })
      .mapErr(e => reporter.warn(e))

    return result
  })
}
