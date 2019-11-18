import { GatsbyNode } from 'gatsby'
import { outputJSON, emptyDir } from 'fs-extra'
import { validateInstanceUniqueness } from '../utils'
import { optionsSchema } from '../schemas'
import {
  PLUGIN_NAME,
  CACHE_DIR,
  TRANSLATIONS_FILE,
  PAGES_REGISTRY_FILE,
  NAMESPACES_REGISTRY_FILE,
} from '../constants'

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = (
  { reporter, store },
  pluginOptions,
) => {
  // Validate plugin options
  const { error } = optionsSchema
    .required()
    .validate(pluginOptions, { abortEarly: false })

  if (error) {
    reporter.panic(
      `[${PLUGIN_NAME}] is misconfigured:\n${error.details
        .map(({ message }) => `- ${message}`)
        .join('\n')}`,
    )
  }

  // Validate that there is only a single plugin instance registered
  validateInstanceUniqueness(store.getState().flattenedPlugins).mapErr(err =>
    reporter.panic(err),
  )

  // Prepare plugin files
  return emptyDir(CACHE_DIR)
    .then(() =>
      Promise.all([
        outputJSON(PAGES_REGISTRY_FILE, {}),
        outputJSON(NAMESPACES_REGISTRY_FILE, []),
        outputJSON(TRANSLATIONS_FILE, {}),
      ]),
    )
    .catch(reporter.panic)
}
