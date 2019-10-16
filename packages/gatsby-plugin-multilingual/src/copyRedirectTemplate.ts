import { copy, pathExists } from 'fs-extra'
import { REDIRECT_TEMPLATE_FILE } from './constants'

export default async (templatePath?: string): Promise<void> => {
  let redirectFile

  if (templatePath && (await pathExists(templatePath))) {
    redirectFile = templatePath
  } else {
    redirectFile = require.resolve('./components/RedirectTemplate.js')
  }

  await copy(redirectFile, REDIRECT_TEMPLATE_FILE)
}
