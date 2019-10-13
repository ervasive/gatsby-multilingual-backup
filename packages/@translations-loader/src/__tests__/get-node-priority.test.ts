import getNodePriority from '../get-node-priority'
import { PLUGIN_NAME } from '../constants'

describe('getNodePriority', (): void => {
  it('should return the set priority back if it is not equal to 0', (): void => {
    expect(getNodePriority('val', 10, [])).toBe(10)
  })

  it('should calculate the priority', (): void => {
    const plugins = [
      {
        name: 'some-plugin',
        pluginOptions: { plugins: [] },
      },
      {
        name: 'non-translations-loader-plugin',
        pluginOptions: { path: '/some-path', plugins: [] },
      },
      {
        name: 'non-translations-loader-plugin',
        pluginOptions: { path: '/some-path', priority: 10, plugins: [] },
      },
      {
        name: PLUGIN_NAME,
        pluginOptions: { path: '/some-path', priority: 1, plugins: [] },
      },
      {
        name: PLUGIN_NAME,
        pluginOptions: { path: '/another-path', priority: 2, plugins: [] },
      },
      {
        name: PLUGIN_NAME,
        pluginOptions: { path: '/translations', plugins: [] },
      },
      {
        name: PLUGIN_NAME,
        pluginOptions: { path: '/translations-2', plugins: [] },
      },
    ]

    expect(getNodePriority('/translations', 0, plugins)).toBe(0)
    expect(getNodePriority('/translations-2', 0, plugins)).toBe(1)
  })
})
