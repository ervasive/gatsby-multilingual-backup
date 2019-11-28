import { Reporter, Store, Actions, Node } from 'gatsby'
import { emptyDir, outputJSON } from 'fs-extra'
import { PLUGIN_NAME } from '../constants'
import {
  registry,
  pageRulesRecord,
  resetPageRulesRecord,
  onPreBootstrap,
  onCreatePage,
} from '../gatsby-node'

const createReporterMock = (): Reporter => ({
  success: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  panic: jest.fn(),
  panicOnBuild: jest.fn(),
  stripIndent: jest.fn(),
  format: jest.fn(),
  setVerbose: jest.fn(),
  setNoColor: jest.fn(),
  uptime: jest.fn(),
  verbose: jest.fn(),
  log: jest.fn(),
  activityTimer: jest.fn(),
  createProgress: jest.fn(),
})

const createStoreMock = (store?: Partial<Store>): Store => ({
  ...{
    getState: (): object => ({ flattenedPlugins: [], pages: new Map() }),
    dispatch: (): void => {},
    subscribe: (): void => {},
    replaceReducer: (): void => {},
  },
  ...store,
})

const createActionsMock = (): Actions => ({
  createPage: jest.fn(),
  deletePage: jest.fn(),
  touchNode: jest.fn(),
  createNode: jest.fn(),
  deleteNode: jest.fn(),
  deleteNodes: jest.fn(),
  createNodeField: jest.fn(),
  createParentChildLink: jest.fn(),
  setWebpackConfig: jest.fn(),
  replaceWebpackConfig: jest.fn(),
  setBabelOptions: jest.fn(),
  setBabelPlugin: jest.fn(),
  setBabelPreset: jest.fn(),
  createJob: jest.fn(),
  setJob: jest.fn(),
  endJob: jest.fn(),
  setPluginStatus: jest.fn(),
  createRedirect: jest.fn(),
  addThirdPartySchema: jest.fn(),
  createTypes: jest.fn(),
  createFieldExtension: jest.fn(),
})

const createNode = (path: string): Node => ({
  path,
  component: '',
  context: {},
  parent: '',
  children: [],
  internal: {
    type: '',
    contentDigest: '',
    owner: '',
  },
  id: '',
})

describe('gatsbyNode', () => {
  describe('onPreBootstrap', () => {
    it('should panic if more than one plugin instance is registered', () => {
      const reporter = createReporterMock()
      const store = createStoreMock({
        getState: () => ({
          flattenedPlugins: [{ name: PLUGIN_NAME }, { name: PLUGIN_NAME }],
        }),
      })

      onPreBootstrap({ reporter, store }, {})

      expect(reporter.panic).toBeCalledTimes(1)
      expect(reporter.panic).toBeCalledWith(
        expect.stringMatching(/more than one plugin instance is registered/i),
      )
    })

    it('should not panic if only one plugin instance is registered', () => {
      const reporter = createReporterMock()
      const store = createStoreMock({
        getState: () => ({
          flattenedPlugins: [{ name: PLUGIN_NAME }],
        }),
      })

      onPreBootstrap({ reporter, store }, {})

      expect(reporter.panic).not.toBeCalled()
    })

    it('should error out a message if the plugin is misconfigured', () => {
      const reporter = createReporterMock()
      const store = createStoreMock()

      // We are testing the options shape extensively in schemas, here we only
      // want to know that the schema validation is executed
      onPreBootstrap({ reporter, store }, { defaultLanguage: 1 })

      expect(reporter.panic).toBeCalledTimes(1)
      expect(reporter.panic).toBeCalledWith(
        expect.stringMatching(/is misconfigured/i),
      )
    })

    it('should generate a valid "pageRulesRecord" from provided rules', () => {
      const reporter = createReporterMock()
      const store = createStoreMock()

      expect(pageRulesRecord).toStrictEqual({})

      onPreBootstrap(
        { reporter, store },
        {
          defaultLanguage: 'en',
          availableLanguages: ['en', 'ru'],
          rules: {
            'page-one': {
              languages: {
                en: '/path-one-en',
                ru: { path: '/path-one-ru', slug: '/slug-one-ru' },
              },
            },
            'page-two': {
              languages: {
                en: '/path-two-en',
                ru: { path: '/path-one-ru', slug: '/slug-two-ru' },
              },
            },
          },
        },
      )

      expect(pageRulesRecord).toStrictEqual({
        '/path-one-en': [
          {
            id: 'page-one',
            language: 'en',
            slug: '/path-one-en',
          },
        ],
        '/path-one-ru': [
          {
            id: 'page-one',
            language: 'ru',
            slug: '/slug-one-ru',
          },
          {
            id: 'page-two',
            language: 'ru',
            slug: '/slug-two-ru',
          },
        ],
        '/path-two-en': [
          {
            id: 'page-two',
            language: 'en',
            slug: '/path-two-en',
          },
        ],
      })

      resetPageRulesRecord()
      expect(pageRulesRecord).toStrictEqual({})
    })

    it('should error out if a rule includes an invalid language key', () => {
      const reporter = createReporterMock()
      const store = createStoreMock()

      expect(pageRulesRecord).toStrictEqual({})

      onPreBootstrap(
        { reporter, store },
        {
          defaultLanguage: 'en',
          availableLanguages: ['en', 'ru'],
          rules: {
            'page-one': {
              languages: {
                en: '/path-one-en',
                es: '/path-one-es',
                de: '/path-one-de',
              },
            },
          },
        },
      )

      expect(reporter.error).toBeCalledTimes(2)

      expect(reporter.error).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(
          /"page-one" rule has an invalid language key: "es"/i,
        ),
      )

      expect(reporter.error).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /"page-one" rule has an invalid language key: "de"/i,
        ),
      )

      expect(pageRulesRecord).toStrictEqual({
        '/path-one-en': [
          {
            id: 'page-one',
            language: 'en',
            slug: '/path-one-en',
          },
        ],
      })

      resetPageRulesRecord()
      expect(pageRulesRecord).toStrictEqual({})
    })

    it('should prepare required plugin files', () => {
      const reporter = createReporterMock()
      const store = createStoreMock()

      onPreBootstrap({ reporter, store }, {})

      // expect(emptyDir).toBeCalledTimes(1)
    })
  })

  describe('onCreatePage', () => {
    it('should process and convert pages specified in user defined rules', () => {
      const reporter = createReporterMock()
      const store = createStoreMock()
      const actionsMock = createActionsMock()
      const pluginOptions = {
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        rules: {
          'page-one': {
            languages: {
              en: '/path-one-en',
              ru: { path: '/path-one-ru', slug: '/slug-one-ru' },
            },
          },
          'page-two': {
            languages: {
              en: '/path-two-en',
              ru: { path: '/path-one-ru', slug: '/slug-two-ru' },
            },
          },
        },
      }

      expect(pageRulesRecord).toStrictEqual({})
      onPreBootstrap({ reporter, store }, pluginOptions)

      onCreatePage(
        { page: createNode('/path-one-en'), actions: actionsMock },
        pluginOptions,
      )
      onCreatePage(
        { page: createNode('/path-one-ru'), actions: actionsMock },
        pluginOptions,
      )

      expect(actionsMock.createPage).toBeCalledTimes(3)
      // expect(actionsMock.createPage).toHaveBeenCalledWith({})

      expect(actionsMock.deletePage).toBeCalledTimes(2)

      resetPageRulesRecord()
      expect(pageRulesRecord).toStrictEqual({})
    })
  })
})
