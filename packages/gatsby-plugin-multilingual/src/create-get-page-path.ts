import getPagePath from './utils/get-page-path'
import { ContextProviderData, PagesRegistry } from './types'

export default (
  pages: PagesRegistry,
  language: string,
  strict: boolean,
): ContextProviderData['getPagePath'] => {
  const result: ContextProviderData['getPagePath'] = value => {
    try {
      return getPagePath(value, { language, strict }, pages)
    } catch (e) {
      throw new Error(
        `The "getPagePath" function returned an error: ${e.message}`,
      )
    }
  }

  return result
}
