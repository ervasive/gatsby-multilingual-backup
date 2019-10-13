import { safeLoad } from 'js-yaml'
import { Transformer } from './types'

export const transformJSON: Transformer = {
  type: 'application/json',
  handler: content => JSON.stringify(JSON.parse(content)),
}

export const transformYAML: Transformer = {
  type: 'text/yaml',
  handler: content => JSON.stringify(safeLoad(content)),
}
