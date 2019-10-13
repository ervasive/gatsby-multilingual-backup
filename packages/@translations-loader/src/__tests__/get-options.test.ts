import getOptions from '../get-options'
import { DEFAULT_OPTIONS } from '../constants'
import { Options } from '../types'

describe('getOptions', (): void => {
  it('should set default values on undefined argument', (): void => {
    expect(getOptions()).toStrictEqual(DEFAULT_OPTIONS)
  })

  it('should override default options from the provided argument', (): void => {
    const source: Options = {
      path: 'custom',
      priority: 101,
      transformers: [
        { type: 'application/json', handler: () => 'custom-value' },
        { type: 'text/yaml', handler: () => 'custom-value' },
        { type: 'custom', handler: () => 'custom-value' },
      ],
      plugins: [],
    }

    expect(getOptions(source)).toStrictEqual(source)
  })

  it('should contain default transformers', (): void => {
    const options = getOptions({
      path: '/path-value',
    })

    expect(options.transformers[0].type).toBe('application/json')
    expect(options.transformers[1].type).toBe('text/yaml')
  })
})
