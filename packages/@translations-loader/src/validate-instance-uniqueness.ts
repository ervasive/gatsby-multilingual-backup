import { Result, Unit } from 'true-myth'
import { GatsbyStorePlugin } from '@gatsby-plugin-multilingual/shared'
import { PLUGIN_NAME } from './constants'

export default (
  path: string,
  plugins: GatsbyStorePlugin[],
): Result<Unit, string> => {
  const pluginInstances = plugins.filter(
    ({ name, pluginOptions }) =>
      name === PLUGIN_NAME && pluginOptions.path === path,
  )

  if (pluginInstances.length > 1) {
    return Result.err(
      `[${PLUGIN_NAME}] more than one plugin instance uses the same ` +
        `translations directory path: "${path}"`,
    )
  }

  return Result.ok(Unit)
}
