import { findIndex } from 'lodash'
import { PluginOptions } from 'gatsby'
import { validateOptions, getOptions } from '../options'

describe('Validate options', (): void => {
  describe('path', (): void => {
    it('should throw on wrong values', (): void => {
      ;[true, NaN, 42, [], {}, Symbol(''), undefined].map((item): void => {
        expect((): void => {
          validateOptions({ path: item, plugins: [] })
        }).toThrow(/"path" value/i)
      })
    })

    it('should not throw on allowed values', (): void => {
      ;['path-string'].map((item): void => {
        expect((): void => {
          validateOptions({ path: item, plugins: [] })
        }).not.toThrow()
      })
    })
  })

  describe('priority', (): void => {
    it('should throw on wrong values', (): void => {
      ;[true, NaN, 'not-a-number', [], {}, Symbol('')].map((item): void => {
        expect((): void => {
          validateOptions({ path: '/', priority: item, plugins: [] })
        }).toThrow(/"priority" value/i)
      })
    })

    it('should not throw on allowed values', (): void => {
      ;[1, undefined].map((item): void => {
        expect((): void => {
          validateOptions({ path: '/', priority: item, plugins: [] })
        }).not.toThrow()
      })
    })
  })

  describe('transformers', (): void => {
    it('should throw on wrong values', (): void => {
      ;[true, NaN, 'not-a-number', Symbol(''), {}].map((item): void => {
        expect((): void => {
          validateOptions(({
            path: '/',
            transformers: item,
            plugins: [],
          } as unknown) as PluginOptions)
        }).toThrow(/"transformers" value/i)
      })
    })

    it('should throw on wrong item shape', (): void => {
      ;[[{ type: 1, handler: 1 }]].map((item): void => {
        expect((): void => {
          validateOptions(({
            path: '/',
            transformers: item,
          } as unknown) as PluginOptions)
        }).toThrow(/"type" value.*"handler" value/is)
      })
    })

    it('should not throw on allowed values', (): void => {
      ;[
        [],
        undefined,
        [
          {
            type: 'text/yaml',
            handler: (): void => {},
          },
        ],
      ].map((item): void => {
        expect((): void => {
          validateOptions(({
            path: '/',
            transformers: item,
          } as unknown) as PluginOptions)
        }).not.toThrow()
      })
    })
  })
})

describe('Get options', (): void => {
  it('should set default values', (): void => {
    const options = getOptions()

    // We don't test 'options.path' because it is a required value
    // enforced by validateOptions function.
    expect(options.priority).toBe(0)

    expect(options.transformers.length).toBe(2)

    expect(
      findIndex(options.transformers, {
        type: 'application/json',
      }),
    ).toBeGreaterThan(-1)

    expect(
      findIndex(options.transformers, {
        type: 'text/yaml',
      }),
    ).toBeGreaterThan(-1)
  })

  it('return user provided transformers', (): void => {
    const options = getOptions({
      path: '/',
      plugins: [],
      transformers: [
        {
          type: 'application/json',
          handler: (): string => 'provided-JSON',
        },
        {
          type: 'text/yaml',
          handler: (): string => 'provided-YAML',
        },
      ],
    })

    expect(options.transformers.length).toBe(2)

    expect(options.transformers[0].handler('')).toBe('provided-JSON')
    expect(options.transformers[1].handler('')).toBe('provided-YAML')
  })
})
