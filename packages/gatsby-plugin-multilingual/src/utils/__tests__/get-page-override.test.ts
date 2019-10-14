import getPageOverride from '../get-page-override'
import { MultilingualOverride } from '../../types'

describe('getPageOverride', () => {
  it('should return Ok(Nothing) on empty overrides array', () => {
    const result = getPageOverride(
      { path: '/page', component: '', context: {} },
      [],
    )

    expect(result.toString()).toBe('Ok(Nothing)')
  })

  it('should return an error message on invalid matching override', () => {
    expect(
      getPageOverride({ path: '/page', component: '', context: {} }, [
        ({
          pageId: '/page',
          languages: 'invalid-value',
        } as unknown) as MultilingualOverride,
      ]).toString(),
    ).toMatch(/page override failed validation.*"languages" must be an array/i)

    expect(
      getPageOverride(
        { path: '/page', component: '', context: {} },
        page =>
          (({
            pageId: '/page',
            languages: 'invalid-value',
          } as unknown) as MultilingualOverride),
      ).toString(),
    ).toMatch(/page override failed validation.*"languages" must be an array/i)
  })

  it('should return an error on throwing override function', () => {
    expect(
      getPageOverride({ path: '/page', component: '', context: {} }, page => {
        throw new Error('error msg')
      }).toString(),
    ).toMatch(/override function threw an Error.*error msg/i)
  })

  it('should return an override on valid data', () => {
    expect(
      getPageOverride({ path: '/page', component: '', context: {} }, [
        {
          pageId: '/page',
          languages: ['en', 'ru'],
        },
      ])
        .unsafelyUnwrap()
        .unsafelyUnwrap(),
    ).toStrictEqual({
      pageId: '/page',
      languages: ['en', 'ru'],
    })

    expect(
      getPageOverride({ path: '/page', component: '', context: {} }, page => ({
        pageId: '/page',
        languages: ['en', 'ru'],
      }))
        .unsafelyUnwrap()
        .unsafelyUnwrap(),
    ).toStrictEqual({
      pageId: '/page',
      languages: ['en', 'ru'],
    })
  })

  it('should get an override from the context pageId value instead of page.path', () => {
    expect(
      getPageOverride(
        {
          path: '/page',
          component: '',
          context: { multilingual: { pageId: 'custom-id', languages: ['en'] } },
        },
        [
          {
            pageId: 'custom-id',
            languages: ['en', 'ru'],
          },
        ],
      )
        .unsafelyUnwrap()
        .unsafelyUnwrap(),
    ).toStrictEqual({
      pageId: 'custom-id',
      languages: ['en', 'ru'],
    })
  })
})
