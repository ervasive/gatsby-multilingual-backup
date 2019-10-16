import { GatsbyNode } from 'gatsby'
import { NAMESPACE_NODE_TYPENAME } from '@gatsby-plugin-multilingual/shared'
import getOptions from '../get-options'
import { processTranslations } from '../translations'

const onCreateNode: GatsbyNode['onCreateNode'] = async (
  { node, getNodesByType, reporter },
  pluginOptions,
) => {
  if (node.internal.type !== NAMESPACE_NODE_TYPENAME) {
    return
  }

  const options = getOptions(pluginOptions)

  processTranslations(getNodesByType(NAMESPACE_NODE_TYPENAME), options).catch(
    reporter.panic,
  )
}

export default onCreateNode
