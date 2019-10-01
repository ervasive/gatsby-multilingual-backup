import fc from 'fast-check'
import {
  isUndefined,
  isBoolean,
  isString,
  isArray,
  isPlainObject,
} from 'lodash'
import getPageOverride from '../get-page-override'

describe('getPageOverride', () => {
  it('should return undefined on empty overrides array', () => {
    expect(
      getPageOverride({ path: '/page', component: '', context: {} }, []),
    ).toBe(undefined)
  })

  it('should return the correct value on valid overrides array', () => {
    const correctOverrideItem = {
      path: '/page',
      process: true,
      languages: ['en'],
    }

    expect(
      getPageOverride({ path: '/page', component: '', context: {} }, [
        { path: '/page-two' },
        correctOverrideItem,
      ]),
    ).toStrictEqual(correctOverrideItem)
  })

  it('should return the correct value on valid overrides function', () => {
    const correctOverrideItem = {
      path: '/page',
      process: true,
      languages: ['en'],
    }

    expect(
      getPageOverride(
        { path: '/page', component: '', context: {} },
        () => correctOverrideItem,
      ),
    ).toStrictEqual(correctOverrideItem)
  })

  it('should throw an error on invalid "path" type', () => {
    fc.assert(
      fc.property(fc.anything().filter(v => !isString(v)), data => {
        expect((): void => {
          getPageOverride(
            { path: '/page', component: '', context: {} },
            () => ({
              path: data,
            }),
          )
        }).toThrow(/invalid page override provided/i)
      }),
    )
  })

  it('should throw an error on invalid "process" type', () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isUndefined(v) || isBoolean(v))),
        data => {
          expect((): void => {
            getPageOverride(
              { path: '/page', component: '', context: {} },
              () => ({
                path: '/page',
                process: data,
              }),
            )
          }).toThrow(/invalid page override provided/i)

          expect((): void => {
            getPageOverride({ path: '/page', component: '', context: {} }, [
              { path: '/page', process: data },
            ])
          }).toThrow(/invalid page override provided/i)
        },
      ),
    )
  })

  it('should throw an error on invalid "languages" type', () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isUndefined(v) || isArray(v))),
        data => {
          expect((): void => {
            getPageOverride(
              { path: '/page', component: '', context: {} },
              () => ({
                path: '/page',
                languages: data,
              }),
            )
          }).toThrow(/invalid page override provided/i)

          expect((): void => {
            getPageOverride({ path: '/page', component: '', context: {} }, [
              { path: '/page', languages: data },
            ])
          }).toThrow(/invalid page override provided/i)
        },
      ),
    )
  })

  it('should throw an error on invalid "languages" item type', () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isString(v) || isPlainObject(v))),
        data => {
          expect((): void => {
            getPageOverride(
              { path: '/page', component: '', context: {} },
              () => ({
                path: '/page',
                languages: [data],
              }),
            )
          }).toThrow(/invalid page override provided/i)

          expect((): void => {
            getPageOverride({ path: '/page', component: '', context: {} }, [
              { path: '/page', languages: [data] },
            ])
          }).toThrow(/invalid page override provided/i)
        },
      ),
    )
  })

  it('should throw an error on invalid "languages.item.language" type', () => {
    fc.assert(
      fc.property(fc.anything().filter(v => !isString(v)), data => {
        expect((): void => {
          getPageOverride(
            { path: '/page', component: '', context: {} },
            () => ({
              path: '/page',
              languages: [{ language: data }],
            }),
          )
        }).toThrow(/invalid page override provided/i)

        expect((): void => {
          getPageOverride({ path: '/page', component: '', context: {} }, [
            { path: '/page', languages: [{ language: data }] },
          ])
        }).toThrow(/invalid page override provided/i)
      }),
    )
  })

  it('should throw an error on invalid "languages.item.path" type', () => {
    fc.assert(
      fc.property(
        fc.anything().filter(v => !(isUndefined(v) || isString(v))),
        data => {
          expect((): void => {
            getPageOverride(
              { path: '/page', component: '', context: {} },
              () => ({
                path: '/page',
                languages: [{ language: 'en', path: data }],
              }),
            )
          }).toThrow(/invalid page override provided/i)

          expect((): void => {
            getPageOverride({ path: '/page', component: '', context: {} }, [
              { path: '/page', languages: [{ language: 'en', path: data }] },
            ])
          }).toThrow(/invalid page override provided/i)
        },
      ),
    )
  })
})
