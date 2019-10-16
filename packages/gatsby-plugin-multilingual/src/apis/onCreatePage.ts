import { GatsbyNode } from 'gatsby'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import getOptions from '../get-options'
import { PLUGIN_NAME } from '../constants'
import generatePages from '../generate-pages'

const onCreatePage: GatsbyNode['onCreatePage'] = async (
  {
    page,
    actions: { createPage, deletePage, createRedirect },
    reporter,
    store,
  },
  pluginOptions,
) => {
  const options = getOptions(pluginOptions)
  const { pages, redirects, errors, removeOriginalPage } = generatePages(
    (page as unknown) as GatsbyPage,
    store.getState().pages,
    options,
  )

  if (errors.length) {
    reporter.warn(
      `[${PLUGIN_NAME}] The following errors were encountered while ` +
        `processing pages:\n${errors.map(e => `- ${e}`).join('\n')}`,
    )
  }

  if (removeOriginalPage) {
    deletePage((page as unknown) as GatsbyPage)
  }

  redirects.forEach(redirect => createRedirect(redirect))
  pages.forEach(page => createPage(page as GatsbyPage))
}

export default onCreatePage
