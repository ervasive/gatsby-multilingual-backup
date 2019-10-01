import shouldPageBeProcessed from '../should-page-be-processed'
import getValidatedOptions from '../../get-validated-options'

describe('shouldPageBeProcessed', () => {
  it('should return false for dev 404 page', () => {
    expect(
      shouldPageBeProcessed(
        { path: '/dev-404-page/', component: '', context: {} },
        getValidatedOptions({ mode: 'greedy', overrides: [] }),
      ),
    ).toBe(false)

    expect(
      shouldPageBeProcessed(
        { path: '/dev-404-page/', component: '', context: {} },
        getValidatedOptions({ mode: 'lazy', overrides: [] }),
      ),
    )
  })

  describe('in "greedy" mode', () => {
    it('should return true for a regular page without overrides', () => {
      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: {} },
          getValidatedOptions({ mode: 'greedy', overrides: [] }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: { multilingual: undefined } },
          getValidatedOptions({ mode: 'greedy', overrides: [] }),
        ),
      ).toBe(true)
    })

    it('should return false when "overrides" instructs so', () => {
      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'greedy',
            overrides: [{ path: '/page' }],
          }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'greedy',
            overrides: [{ path: '/page', process: true }],
          }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'greedy',
            overrides: [{ path: '/page', process: false }],
          }),
        ),
      ).toBe(false)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'greedy',
            overrides: [{ path: '/page-two' }],
          }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'greedy',
            overrides: () => ({ path: '/page', process: true }),
          }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'greedy',
            overrides: () => ({ path: '/page', process: false }),
          }),
        ),
      ).toBe(false)
    })

    it('should return false when "context.multilingual" instructs so', () => {
      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: { multilingual: false } },
          getValidatedOptions({ mode: 'greedy', overrides: [] }),
        ),
      ).toBe(false)
    })
  })

  describe('in "lazy" mode', () => {
    it('should return false for a regular page without overrides', () => {
      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: {} },
          getValidatedOptions({ mode: 'lazy', overrides: [] }),
        ),
      ).toBe(false)

      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: { multilingual: undefined } },
          getValidatedOptions({ mode: 'lazy', overrides: [] }),
        ),
      ).toBe(false)
    })

    it('should return true when "overrides" instructs so', () => {
      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({ mode: 'lazy', overrides: [{ path: '/page' }] }),
        ),
      ).toBe(false)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'lazy',
            overrides: [{ path: '/page', process: true }],
          }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'lazy',
            overrides: [{ path: '/page', process: false }],
          }),
        ),
      ).toBe(false)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'lazy',
            overrides: [{ path: '/page-two' }],
          }),
        ),
      ).toBe(false)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'lazy',
            overrides: () => ({ path: '/page', process: true }),
          }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '/page', component: '', context: {} },
          getValidatedOptions({
            mode: 'lazy',
            overrides: () => ({ path: '/page', process: false }),
          }),
        ),
      ).toBe(false)
    })

    it('should return true when "context.multilingual" instructs so', () => {
      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: { multilingual: true } },
          getValidatedOptions({ mode: 'lazy', overrides: [] }),
        ),
      ).toBe(true)

      expect(
        shouldPageBeProcessed(
          { path: '', component: '', context: { multilingual: {} } },
          getValidatedOptions({ mode: 'lazy', overrides: [] }),
        ),
      ).toBe(true)
    })
  })
})
