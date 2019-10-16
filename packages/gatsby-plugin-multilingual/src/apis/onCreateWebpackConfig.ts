import { GatsbyNode } from 'gatsby'
import {
  CACHE_PAGES_FILE,
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
} from '../constants'

const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        pages: CACHE_PAGES_FILE,
        namespaces: CACHE_NAMESPACES_FILE,
        'translations-all': CACHE_TRANSLATIONS_ALL_FILE,
        'translations-default': CACHE_TRANSLATIONS_DEFAULT_FILE,
      },
    },
  })
}

export default onCreateWebpackConfig
