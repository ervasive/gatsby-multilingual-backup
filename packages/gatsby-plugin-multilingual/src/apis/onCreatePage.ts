import { GatsbyNode } from 'gatsby'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { getOptions } from '../utils'
import { processPage, commitChanges } from '../pages-processing'

export const onCreatePage: GatsbyNode['onCreatePage'] = async (
  { page, actions, reporter, store },
  pluginOptions,
) => {
  const sourcePage = (page as unknown) as GatsbyPage
  const pages = store.getState().pages
  const options = getOptions(pluginOptions)

  commitChanges(processPage(sourcePage, pages, options), actions, reporter)
}
