import { GatsbyNode } from 'gatsby'
import { outputJSON, emptyDir } from 'fs-extra'
import { NAMESPACE_NODE_TYPENAME } from '@gatsby-plugin-multilingual/shared'
import validateInstanceUniqueness from '../utils/validate-instance-uniqueness'
import getOptions from '../get-options'
import { processTranslations } from '../translations'
import {
  PLUGIN_NAME,
  CACHE_DIR,
  TRANSLATIONS_FILE,
  PAGES_REGISTRY_FILE,
  NAMESPACES_FILE,
} from '../constants'
import copyRedirectTemplate from '../copyRedirectTemplate'

import optionsSchema from '../schemas/options'
import { Maybe } from 'true-myth'

const onPreBootstrap: GatsbyNode['onPreBootstrap'] = (
  { getNodesByType, reporter, store },
  pluginOptions,
) => {
  // Validate plugin options
  const { error: optionsValidationError } = optionsSchema
    .required()
    .validate(pluginOptions, { abortEarly: false })

  Maybe.of(optionsValidationError).map(e =>
    reporter.panic(
      `[${PLUGIN_NAME}] is misconfigured:\n${e.details
        .map(({ message }) => `- ${message}`)
        .join('\n')}`,
    ),
  )

  const options = getOptions(pluginOptions)

  // Validate that there is only a single plugin instance registered
  validateInstanceUniqueness(store.getState().flattenedPlugins).mapErr(err =>
    reporter.panic(err),
  )

  return emptyDir(CACHE_DIR)
    .then(() =>
      Promise.all([
        outputJSON(PAGES_REGISTRY_FILE, {}),
        outputJSON(NAMESPACES_FILE, []),
        outputJSON(TRANSLATIONS_FILE, {}),
        copyRedirectTemplate(options.pathToRedirectTemplate),
        processTranslations(getNodesByType(NAMESPACE_NODE_TYPENAME), options),
      ]),
    )
    .catch(reporter.panic)
}

export default onPreBootstrap
