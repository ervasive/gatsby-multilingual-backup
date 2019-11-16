import { GatsbyNode } from 'gatsby'
import {
  PAGES_REGISTRY_FILE,
  NAMESPACES_REGISTRY_FILE,
  TRANSLATIONS_FILE,
} from '../constants'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = async ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        namespaces: NAMESPACES_REGISTRY_FILE,
        translations: TRANSLATIONS_FILE,
        'pages-registry': PAGES_REGISTRY_FILE,
      },
    },
  })
}
