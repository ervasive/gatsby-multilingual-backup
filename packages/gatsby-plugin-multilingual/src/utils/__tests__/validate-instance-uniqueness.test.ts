import { PLUGIN_NAME } from '../../constants'
import { validateInstanceUniqueness } from '..'

describe('validateInstanceUniqueness', (): void => {
  it(
    'should return Result.err if plugins contain more than one plugin ' +
      'instance',
    (): void => {
      expect(
        validateInstanceUniqueness([
          {
            id: '',
            name: PLUGIN_NAME,
            pluginOptions: { plugins: [] },
          },
          {
            id: '',
            name: PLUGIN_NAME,
            pluginOptions: { plugins: [] },
          },
        ]).toString(),
      ).toMatch(/err.*more than one plugin instance/i)
    },
  )

  it(
    'should return Result.ok if plugins array does contain more than one plugin ' +
      'instance',
    (): void => {
      expect(
        validateInstanceUniqueness([
          {
            id: '',
            name: PLUGIN_NAME,
            pluginOptions: { plugins: [] },
          },
        ]).toString(),
      ).toMatch(/ok/i)
    },
  )
})
