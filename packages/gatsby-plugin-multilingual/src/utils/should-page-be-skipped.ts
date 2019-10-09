import { Maybe } from 'true-myth'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { Options, MultilingualOverride } from '../types'

export default (
  page: GatsbyPage,
  mode: Options['mode'],
  override: Maybe<MultilingualOverride>,
): boolean => {
  if (page.path === '/dev-404-page/') {
    return false
  }

  // First, let's check if the page is covered by the global overrides
  if (override.isJust()) {
    const { shouldBeProcessed } = override.unsafelyUnwrap()

    if (mode === 'greedy' && shouldBeProcessed === false) {
      return false
    }

    if (mode === 'lazy' && shouldBeProcessed === true) {
      return true
    }
  }

  // OK, as a second step let's check the "context" property
  if (mode === 'greedy' && page.context.multilingual === false) {
    return false
  }

  if (mode === 'lazy' && page.context.multilingual) {
    return true
  }

  // Fallback to mode
  if (mode === 'greedy') {
    return true
  } else {
    return false
  }
}
