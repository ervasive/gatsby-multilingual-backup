import { GatsbyNode } from 'gatsby'
import {
  PAGES_REGISTRY_FILE,
  PATHNAMES_REGISTRY_FILE,
  NAMESPACES_FILE,
  TRANSLATIONS_FILE,
} from '../constants'

const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = async ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        namespaces: NAMESPACES_FILE,
        translations: TRANSLATIONS_FILE,
        'pages-registry': PAGES_REGISTRY_FILE,
        'pathnames-registry': PATHNAMES_REGISTRY_FILE,
      },
    },
  })
}

export default onCreateWebpackConfig
