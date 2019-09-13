import { navigate as gatsbyNavigate } from 'gatsby'
import getPagePath from './utils/get-page-path'
import { ContextProviderData, PagesRegistry } from './types'

export default (
  pages: PagesRegistry,
  language: string,
  strict: boolean,
): ContextProviderData['navigate'] => {
  const navigate: ContextProviderData['navigate'] = (value, options) => {
    try {
      const path = getPagePath(value, { language, strict }, pages)
      gatsbyNavigate(path as string, options)
    } catch (e) {
      throw new Error(`The "navigate" function returned an error: ${e.message}`)
    }
  }

  return navigate
}
