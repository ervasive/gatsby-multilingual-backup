import { GatsbyStorePlugin } from '@gatsby-plugin-multilingual/shared'
import { PLUGIN_NAME } from './constants'

// Determine a node's priority value from plugin options or calculate it
// based on the plugin's index in the "store"
export default (
  path: string,
  priority: number,
  plugins: GatsbyStorePlugin[],
): number => {
  if (priority === 0) {
    return (
      plugins
        // Filter out "translations-loader" plugins with set priority
        .filter(
          ({ name, pluginOptions }) =>
            name === PLUGIN_NAME && !pluginOptions.priority,
        )
        .map(({ pluginOptions }) => pluginOptions.path as string)
        .indexOf(path)
    )
  } else {
    return priority
  }
}
