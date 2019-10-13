import transformNodeContent from '../transform-node-content'
import { transformJSON } from '../transformers'

describe('transformNodeContent', () => {
  it('should return Nothing if no type was proided', () => {
    expect(
      transformNodeContent('content-val', 'path-val', undefined, [
        { type: 'text', handler: () => 'transformed-content' },
      ]).toString(),
    ).toBe('Nothing')
  })

  it('should return Nothing if there is no suitable transformer found', () => {
    expect(
      transformNodeContent('content-val', 'path-val', 'type-val').toString(),
    ).toBe('Nothing')

    expect(
      transformNodeContent(
        'content-val',
        'path-val',
        'type-val',
        [],
      ).toString(),
    ).toBe('Nothing')
  })

  it('should return Result.err if the handler throws', () => {
    expect(
      transformNodeContent('content-val', 'path-val', 'type-val', [
        {
          type: 'type-val',
          handler: () => {
            throw new Error('handler error')
          },
        },
      ]).toString(),
    ).toMatch(/Just\(Err\(.*"type-val".*threw an error.*handler error.*\)\)/i)
  })

  it('should return Result.err if the transformed content is invalid JSON', () => {
    expect(
      transformNodeContent('invalid content JSON', 'path-val', 'type-val', [
        {
          type: 'type-val',
          handler: c => c,
        },
      ]).toString(),
    ).toMatch(
      /Just\(Err\(.*there was an error validating the "path-val" translations file.*\)\)/i,
    )
  })

  it('should succesfully return transformed content', () => {
    expect(
      transformNodeContent('{"key": "val"}', 'path-val', 'application/json', [
        transformJSON,
      ]).toString(),
    ).toMatch(/Just\(Ok\({"key":"val"}\)\)/i)
  })
})
