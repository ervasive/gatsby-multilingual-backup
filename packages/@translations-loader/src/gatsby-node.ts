import path from 'path'
import { ensureDir } from 'fs-extra'
import { findIndex } from 'lodash'
import { GatsbyNode } from 'gatsby'
import {
  NAMESPACE_NODE_TYPENAME,
  NamespaceNode,
  GatsbyStorePlugin,
} from '@gatsby-plugin-multilingual/shared'
import getValidatedOptions from './get-validated-options'
import { PLUGIN_NAME, SOURCE_FILESYSTEM_INSTANCE_NAME } from './constants'
import { StorePluginLoader } from './types'

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = async (
  { reporter, store },
  pluginOptions,
): Promise<void> => {
  const options = getValidatedOptions(pluginOptions)

  // Panic if more than one plugin instance uses the same directory path
  const pluginInstances = store
    .getState()
    .flattenedPlugins.filter(
      (plugin: GatsbyStorePlugin): boolean =>
        plugin.name === PLUGIN_NAME &&
        plugin.pluginOptions.path === options.path,
    )

  if (pluginInstances.length > 1) {
    reporter.panic(
      `The "${options.path}" path is already in use by another instance of ` +
        `the "${PLUGIN_NAME}" or the default translations loader of the ` +
        `"gatsby-plugin-multilingual" plugin.\n`, // TODO: add URL to docs
    )
  }

  // Attempt to create specified directory for translations files
  try {
    await ensureDir(options.path)
  } catch (err) {
    reporter.error(
      `There was a problem creating '${path.resolve(
        options.path,
      )}' directory to store translations files.`,
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
  const options = getValidatedOptions(pluginOptions)

  // Continue only if we have an appropriate "node" type
  if (node.sourceInstanceName !== SOURCE_FILESYSTEM_INSTANCE_NAME) {
    return
  }

  // Check if the "node" belongs to the current plugin "instance" by comparing
  // its parent directory path to the provided "options.path".
  if (path.parse(node.dir as string).dir !== path.resolve(options.path)) {
    return
  }

  // Do we know how to transform its content with the default or user provided
  // transformers to a valid JSON? If no, abort
  const transformerIndex = findIndex(options.transformers, {
    type: node.internal.mediaType,
  })

  if (transformerIndex < 0) {
    return
  }

  const transformer = options.transformers[transformerIndex]

  // Load and validate the node's content
  let nodeContent: string | Error

  // Transform the node content with specified transformer
  try {
    nodeContent = transformer.handler(await loadNodeContent(node))
  } catch (e) {
    reporter.panic(
      `The transformer for ${transformer.type} media type returned an error.`,
      e,
    )
    return
  }

  // Validate that the loaded content is in fact is a valid JSON data
  try {
    JSON.parse(nodeContent as string)
  } catch (e) {
    reporter.panic(
      `There was an error validating one of the translations files:\n` +
        `${node.absolutePath}\n`,
      e,
    )
    return
  }

  // Get the node's priority value from plugin options or calculate it based on
  // the plugin's index in the "store".
  let priority

  if (options.priority === 0) {
    const pluginInstancesWithoutPriority = store
      .getState()
      .flattenedPlugins.filter(
        (plugin: GatsbyStorePlugin): boolean =>
          plugin.name === PLUGIN_NAME &&
          (!plugin.pluginOptions || !plugin.pluginOptions.priority),
      )
      .map((plugin: StorePluginLoader): string => plugin.pluginOptions.path)

    priority = pluginInstancesWithoutPriority.indexOf(options.path)
  } else {
    priority = options.priority
  }

  // Get "language" and "namespace" values from the node's relative path
  const { dir: language, name: namespace } = path.parse(
    node.relativePath as string,
  )

  const namespaceNode: NamespaceNode = {
    id: createNodeId(`${node.id}-${SOURCE_FILESYSTEM_INSTANCE_NAME}`),
    parent: node.id,
    children: [],
    internal: {
      type: NAMESPACE_NODE_TYPENAME,
      mediaType: '​​application/json',
      contentDigest: createContentDigest(nodeContent),
      owner: '',
      content: '',
    },
    language,
    namespace,
    priority,
    data: nodeContent as string,
  }

  createNode(namespaceNode)
  createParentChildLink({ parent: node, child: namespaceNode })
}
