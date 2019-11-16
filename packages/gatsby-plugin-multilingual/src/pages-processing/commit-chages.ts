import { Actions, Reporter } from 'gatsby'
import { PLUGIN_NAME } from '../constants'
import { PagesProcessingResult } from '../types'

export const commitChanges = async (
  {
    messages,
    pagesToDelete,
    pagesToCreate,
    redirectsToCreate,
  }: PagesProcessingResult,
  actions: Actions,
  reporter: Reporter,
): Promise<void> => {
  messages.forEach(({ type, message }) =>
    reporter[type](`[${PLUGIN_NAME}] ${message}`),
  )

  pagesToDelete.forEach(page => actions.deletePage(page))
  pagesToCreate.forEach(page => actions.createPage(page))
  redirectsToCreate.forEach(redirect => actions.createRedirect(redirect))
}
