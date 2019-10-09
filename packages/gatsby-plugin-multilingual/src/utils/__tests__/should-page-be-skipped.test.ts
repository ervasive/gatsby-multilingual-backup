import { Maybe } from 'true-myth'
import shouldPageBeSkipped from '../should-page-be-skipped'
import { MultilingualOverride, Mode } from '../../types'

describe('shouldPageBeProcessed', () => {
  it('should return false for dev 404 page', () => {
    expect(
      shouldPageBeSkipped(
        { path: '/dev-404-page/', component: '', context: {} },
        Mode.Greedy,
        Maybe.nothing<MultilingualOverride>(),
      ),
    ).toBe(false)

    expect(
      shouldPageBeSkipped(
        { path: '/dev-404-page/', component: '', context: {} },
        Mode.Lazy,
        Maybe.nothing<MultilingualOverride>(),
      ),
    ).toBe(false)
  })

  describe('in "greedy" mode', () => {
    it('should return true for a regular page without an override', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: {} },
          Mode.Greedy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)

      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: undefined } },
          Mode.Greedy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)
    })

    it('should return true with existing "override"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Greedy,
          Maybe.just<MultilingualOverride>({ pageId: '/page' }),
        ),
      ).toBe(true)
    })

    it('should return true with existing "override" and explicit "shouldBeProcessed=true"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Greedy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: true,
          }),
        ),
      ).toBe(true)
    })

    it('should return false with existing "override" and explicit "shouldBeProcessed=false"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Greedy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: false,
          }),
        ),
      ).toBe(false)
    })

    it('should return false when "context.multilingual" instructs so', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: false } },
          Mode.Greedy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)
    })
  })

  describe('in "lazy" mode', () => {
    it('should return false for a regular page without an override', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: {} },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)

      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: undefined } },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)
    })

    it('should return false with existing "override"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Lazy,
          Maybe.just<MultilingualOverride>({ pageId: '/page' }),
        ),
      ).toBe(false)
    })

    it('should return true with existing "override" and explicit "shouldBeProcessed=true"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Lazy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: true,
          }),
        ),
      ).toBe(true)
    })

    it('should return false with existing "override" and explicit "shouldBeProcessed=false"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Lazy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: false,
          }),
        ),
      ).toBe(false)
    })

    it('should return true when "context.multilingual" instructs so', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: true } },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)

      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: {} } },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)
    })
  })
})
