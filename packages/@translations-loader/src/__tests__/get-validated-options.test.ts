import fc from 'fast-check'
import { isString, isUndefined, isPlainObject, isFunction } from 'lodash'
import getValidatedOptions from '../get-validated-options'

describe('getValidatedOptions', (): void => {
  it('should throw on invalid argument types', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isPlainObject(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions(data)
          }).toThrow(/invalid plugin options/i)
        },
      ),
    )
  })

  it('should throw on invalid "path" values', (): void => {
    fc.assert(
      fc.property(fc.anything().filter(v => !isString(v)), data => {
        expect((): void => {
          getValidatedOptions({ path: data })
        }).toThrow(/"path" value/i)
      }),
    )
  })

  it('should throw on invalid "priority" values', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(Number.isInteger(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ path: '/', priority: data })
          }).toThrow(/"priority" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "transformers" types', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(Array.isArray(v) || isUndefined(v))),
        data => {
          expect((): void => {
            getValidatedOptions({ path: '/', transformers: data })
          }).toThrow(/"transformers" value/i)
        },
      ),
    )
  })

  it('should throw on invalid "transformers" shape', (): void => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !isString(v)),
        fc.anything().filter(v => !isFunction(v)),
        (type, handler) => {
          expect((): void => {
            getValidatedOptions({
              path: '/',
              transformers: [{ type, handler }],
            })
          }).toThrow(/"type" value.*"handler" value/is)
        },
      ),
    )
  })

  it('should return validated options with overriden transformers', (): void => {
    const options = getValidatedOptions({
      path: '/path-value',
      priority: 10,
      transformers: [
        {
          type: 'text/custom',
          handler: (content: string): string => `custom-handler: ${content}`,
        },
        {
          type: 'application/json',
          handler: (content: string): string => `json-handler: ${content}`,
        },
        {
          type: 'text/yaml',
          handler: (content: string): string => `yaml-handler: ${content}`,
        },
      ],
    })

    expect(options.path).toBe('/path-value')
    expect(options.priority).toBe(10)
    expect(options.transformers[0].type).toBe('text/custom')
    expect(options.transformers[0].handler('test')).toBe(`custom-handler: test`)
    expect(options.transformers[1].type).toBe('application/json')
    expect(options.transformers[1].handler('test')).toBe(`json-handler: test`)
    expect(options.transformers[2].type).toBe('text/yaml')
    expect(options.transformers[2].handler('test')).toBe(`yaml-handler: test`)
  })

  it('should return validated options with default values', (): void => {
    const options = getValidatedOptions({
      path: '/path-value',
    })

    expect(options.path).toBe('/path-value')
    expect(options.priority).toBe(0)
    expect(options.transformers[0].type).toBe('application/json')
    expect(options.transformers[1].type).toBe('text/yaml')
  })
})
