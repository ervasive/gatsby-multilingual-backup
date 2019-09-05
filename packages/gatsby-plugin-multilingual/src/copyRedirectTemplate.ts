import { copy, pathExists } from 'fs-extra'
import { REDIRECT_TEMPLATE_FILE } from './constants'

export default async (defaultTemplatePath?: string): Promise<void> => {
  let redirectFile

  if (defaultTemplatePath && (await pathExists(defaultTemplatePath))) {
    redirectFile = defaultTemplatePath
  } else {
    redirectFile = require.resolve('./RedirectTemplate.js')
  }

  await copy(redirectFile, REDIRECT_TEMPLATE_FILE)
}
