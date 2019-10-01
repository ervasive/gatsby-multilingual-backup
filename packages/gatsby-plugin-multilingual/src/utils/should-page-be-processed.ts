import { isPlainObject } from 'lodash'
import { GatsbyPage } from '@gatsby-plugin-multilingual/shared'
import { Options } from '../types'

export default (page: GatsbyPage, { mode, overrides }: Options): boolean => {
  if (page.path === '/dev-404-page/') {
    return false
  }

  // First, let's check if the page is covered by the global overrides
  const override = Array.isArray(overrides)
    ? overrides.find(({ path }) => path === page.path)
    : overrides(page)

  if (override && isPlainObject(override)) {
    if (mode === 'greedy' && override.process === false) {
      return false
    }

    if (mode === 'lazy' && override.process === true) {
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
