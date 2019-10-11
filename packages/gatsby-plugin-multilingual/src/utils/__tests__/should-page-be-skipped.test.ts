import { Maybe } from 'true-myth'
import shouldPageBeSkipped from '../should-page-be-skipped'
import { MultilingualOverride, Mode } from '../../types'

describe('shouldPageBeskipped', () => {
  it('should return true for dev 404 page', () => {
    expect(
      shouldPageBeSkipped(
        { path: '/dev-404-page/', component: '', context: {} },
        Mode.Greedy,
        Maybe.nothing<MultilingualOverride>(),
      ),
    ).toBe(true)

    expect(
      shouldPageBeSkipped(
        { path: '/dev-404-page/', component: '', context: {} },
        Mode.Lazy,
        Maybe.nothing<MultilingualOverride>(),
      ),
    ).toBe(true)
  })

  describe('in "greedy" mode', () => {
    it('should return false for a regular page without an "override"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: {} },
          Mode.Greedy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)

      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: undefined } },
          Mode.Greedy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)
    })

    it('should return false if an "override" exists but does not disable processing implicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Greedy,
          Maybe.just<MultilingualOverride>({ pageId: '/page' }),
        ),
      ).toBe(false)
    })

    it('should return false if an "override" exists and enables processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Greedy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: true,
          }),
        ),
      ).toBe(false)
    })

    it('should return true if an "override" exists and disables processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Greedy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: false,
          }),
        ),
      ).toBe(true)
    })

    it('should return true if "context" exists and disables processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: false } },
          Mode.Greedy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)
    })
  })

  describe('in "lazy" mode', () => {
    it('should return true for a regular page without an "override"', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: {} },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)

      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: undefined } },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(true)
    })

    it('should return true if an "override" exists but does not enable processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Lazy,
          Maybe.just<MultilingualOverride>({ pageId: '/page' }),
        ),
      ).toBe(true)
    })

    it('should return false if an "override" exists and enables processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Lazy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: true,
          }),
        ),
      ).toBe(false)
    })

    it('should return true if an "override" exists and disables processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '/page', component: '', context: {} },
          Mode.Lazy,
          Maybe.just<MultilingualOverride>({
            pageId: '/page',
            shouldBeProcessed: false,
          }),
        ),
      ).toBe(true)
    })

    it('should return false if "context" exists and enables processing explicitly', () => {
      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: true } },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)

      expect(
        shouldPageBeSkipped(
          { path: '', component: '', context: { multilingual: {} } },
          Mode.Lazy,
          Maybe.nothing<MultilingualOverride>(),
        ),
      ).toBe(false)
    })
  })
})
