import { safeLoad } from 'js-yaml'
import { Transformer } from './types'

export const transformJSON: Transformer = {
  type: 'application/json',
  handler: (content): string | Error => {
    return content
  },
}

export const transformYAML: Transformer = {
  type: 'text/yaml',
  handler: (content): string | Error => {
    return JSON.stringify(safeLoad(content))
  },
}
