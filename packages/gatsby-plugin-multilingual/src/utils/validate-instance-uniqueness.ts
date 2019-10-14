import { Result, Unit } from 'true-myth'
import { GatsbyStorePlugin } from '@gatsby-plugin-multilingual/shared'
import { PLUGIN_NAME } from '../constants'

export default (plugins: GatsbyStorePlugin[]): Result<Unit, string> => {
  if (plugins.filter(({ name }) => name === PLUGIN_NAME).length > 1) {
    return Result.err(
      `[${PLUGIN_NAME}] more than one plugin instance is registered.`,
    )
  }

  return Result.ok(Unit)
}
