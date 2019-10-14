import { PLUGIN_NAME } from '../constants'
import validateInstanceUniqueness from '../validate-instance-uniqueness'

describe('validateInstanceUniqueness', (): void => {
  it(
    'should return Result.err if plugins contain more than one plugin ' +
      'instance with the same path',
    (): void => {
      expect(
        validateInstanceUniqueness('path-val', [
          {
            name: PLUGIN_NAME,
            pluginOptions: { path: 'path-val', plugins: [] },
          },
          {
            name: PLUGIN_NAME,
            pluginOptions: { path: 'path-val', plugins: [] },
          },
        ]).toString(),
      ).toMatch(/err.*more than one plugin instance/i)

      expect(
        validateInstanceUniqueness('path-val', [
          {
            name: PLUGIN_NAME,
            pluginOptions: { path: 'path-val', priority: 1, plugins: [] },
          },
          {
            name: PLUGIN_NAME,
            pluginOptions: { path: 'path-val', priority: 2, plugins: [] },
          },
        ]).toString(),
      ).toMatch(/err.*more than one plugin instance/i)
    },
  )

  it(
    'should return Result.ok if plugins array does contain more than one plugin ' +
      'instance with the same path',
    (): void => {
      expect(
        validateInstanceUniqueness('path-val', [
          {
            name: PLUGIN_NAME,
            pluginOptions: { path: 'path-val', plugins: [] },
          },
        ]).toString(),
      ).toMatch(/ok/i)
    },
  )
})
