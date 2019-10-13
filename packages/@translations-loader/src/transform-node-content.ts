import { Maybe, Result } from 'true-myth'
import { PLUGIN_NAME } from './constants'
import { Transformer } from './types'

export default (
  content: string,
  path: string,
  type?: string,
  transformers?: Transformer[],
): Maybe<Result<string, string>> =>
  // Try to find a default or user defined transformer for the provided type
  Maybe.of((transformers || []).find(t => t.type === type))
    // Try to transform the content with the provided transformer's handler
    .map(t => {
      try {
        return Result.ok<string, string>(t.handler(content))
      } catch (e) {
        return Result.err<string, string>(
          `[${PLUGIN_NAME}] The "${t.type}" transformer handler function ` +
            `threw an error: ${e}`,
        )
      }
    })
    // Validate that the transformed content is in fact is a valid JSON data
    .map(v => {
      if (Result.isErr(v)) {
        return v
      }

      try {
        JSON.parse(content)
        return v
      } catch (e) {
        return Result.err<string, string>(
          `[${PLUGIN_NAME}] There was an error validating the "${path}" ` +
            `translations file: ${e}`,
        )
      }
    })
