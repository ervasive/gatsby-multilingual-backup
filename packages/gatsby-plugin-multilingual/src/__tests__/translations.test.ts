import path from 'path'
import { NamespaceNode } from '@gatsby-plugin-multilingual/shared'
import { aggregateTranslations } from '../translations'
import getOptions from '../get-options'
import {
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
  PUBLIC_TRANSLATIONS_DIR,
} from '../constants'

const nodeFactory = (
  language: string,
  namespace: string,
  priority: number,
  data: string,
): NamespaceNode => ({
  id: '',
  parent: '',
  children: [],
  internal: {
    type: '',
    contentDigest: '',
    owner: '',
  },
  language,
  namespace,
  priority,
  data,
})

describe('Aggregate translations files', (): void => {
  describe('should return default structure on empty nodes and', (): void => {
    it('single language', async (): Promise<void> => {
      expect.assertions(1)
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en'],
        defaultNamespace: 'common',
      })

      const expected = {
        [CACHE_TRANSLATIONS_ALL_FILE]: {
          en: { common: {} },
        },
        [CACHE_TRANSLATIONS_DEFAULT_FILE]: {
          en: { common: {} },
        },
        [CACHE_NAMESPACES_FILE]: ['common'],
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `common.json`)]: {},
      }

      const translations = await aggregateTranslations([], options)
      expect(translations).toStrictEqual(expected)
    })

    it('multiple languages', async (): Promise<void> => {
      expect.assertions(1)
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        defaultNamespace: 'common',
      })

      const expected = {
        [CACHE_TRANSLATIONS_ALL_FILE]: {
          en: { common: {} },
          ru: { common: {} },
        },
        [CACHE_TRANSLATIONS_DEFAULT_FILE]: {
          en: { common: {} },
        },
        [CACHE_NAMESPACES_FILE]: ['common'],
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `common.json`)]: {},
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'ru', `common.json`)]: {},
      }

      const translations = await aggregateTranslations([], options)
      expect(translations).toStrictEqual(expected)
    })
  })

  describe('should return data for multiple namespaces and', (): void => {
    it('single language', async (): Promise<void> => {
      expect.assertions(1)
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en'],
        defaultNamespace: 'common',
      })

      const nodes: NamespaceNode[] = [
        nodeFactory('en', 'common', 0, '{"key": "value"}'),
        nodeFactory('en', 'extra', 0, '{"key": "value"}'),
      ]

      const expected = {
        [CACHE_TRANSLATIONS_ALL_FILE]: {
          en: { common: { key: 'value' }, extra: { key: 'value' } },
        },
        [CACHE_TRANSLATIONS_DEFAULT_FILE]: {
          en: { common: { key: 'value' }, extra: { key: 'value' } },
        },
        [CACHE_NAMESPACES_FILE]: ['common', 'extra'],
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `common.json`)]: {
          key: 'value',
        },
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `extra.json`)]: {
          key: 'value',
        },
      }

      const translations = await aggregateTranslations(nodes, options)
      expect(translations).toStrictEqual(expected)
    })
  })

  it('multiple languages', async (): Promise<void> => {
    expect.assertions(1)
    const options = getOptions({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ru'],
      defaultNamespace: 'common',
    })

    const nodes: NamespaceNode[] = [
      nodeFactory('en', 'common', 0, '{"key": "value"}'),
      nodeFactory('en', 'extra', 0, '{"key": "value"}'),
      nodeFactory('ru', 'common', 0, '{"key": "value"}'),
      nodeFactory('ru', 'extra', 0, '{"key": "value"}'),
    ]

    const expected = {
      [CACHE_TRANSLATIONS_ALL_FILE]: {
        en: { common: { key: 'value' }, extra: { key: 'value' } },
        ru: { common: { key: 'value' }, extra: { key: 'value' } },
      },
      [CACHE_TRANSLATIONS_DEFAULT_FILE]: {
        en: { common: { key: 'value' }, extra: { key: 'value' } },
      },
      [CACHE_NAMESPACES_FILE]: ['common', 'extra'],
      [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `common.json`)]: {
        key: 'value',
      },
      [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `extra.json`)]: {
        key: 'value',
      },
      [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'ru', `common.json`)]: {
        key: 'value',
      },
      [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'ru', `extra.json`)]: {
        key: 'value',
      },
    }

    const translations = await aggregateTranslations(nodes, options)
    expect(translations).toStrictEqual(expected)
  })

  describe('should take into account priority value', (): void => {
    it('single language', async (): Promise<void> => {
      expect.assertions(1)
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en'],
        defaultNamespace: 'common',
      })

      const nodes: NamespaceNode[] = [
        nodeFactory('en', 'common', 10, '{"key": "value-10"}'),
        nodeFactory('en', 'common', 0, '{"key": "value"}'),
        nodeFactory('en', 'extra', 10, '{"key": "value-10"}'),
        nodeFactory('en', 'extra', 0, '{"key": "value"}'),
      ]

      const expected = {
        [CACHE_TRANSLATIONS_ALL_FILE]: {
          en: { common: { key: 'value-10' }, extra: { key: 'value-10' } },
        },
        [CACHE_TRANSLATIONS_DEFAULT_FILE]: {
          en: { common: { key: 'value-10' }, extra: { key: 'value-10' } },
        },
        [CACHE_NAMESPACES_FILE]: ['common', 'extra'],
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `common.json`)]: {
          key: 'value-10',
        },
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `extra.json`)]: {
          key: 'value-10',
        },
      }

      const translations = await aggregateTranslations(nodes, options)
      expect(translations).toStrictEqual(expected)
    })

    it('multiple languages', async (): Promise<void> => {
      expect.assertions(1)
      const options = getOptions({
        defaultLanguage: 'en',
        availableLanguages: ['en', 'ru'],
        defaultNamespace: 'common',
      })

      const nodes: NamespaceNode[] = [
        nodeFactory('en', 'common', 10, '{"key": "value-10"}'),
        nodeFactory('ru', 'common', 10, '{"key": "value-10"}'),
        nodeFactory('en', 'common', 0, '{"key": "value"}'),
        nodeFactory('ru', 'common', 0, '{"key": "value"}'),
        nodeFactory('en', 'extra', 10, '{"key": "value-10"}'),
        nodeFactory('ru', 'extra', 10, '{"key": "value-10"}'),
        nodeFactory('en', 'extra', 0, '{"key": "value"}'),
        nodeFactory('ru', 'extra', 0, '{"key": "value"}'),
      ]

      const expected = {
        [CACHE_TRANSLATIONS_ALL_FILE]: {
          en: { common: { key: 'value-10' }, extra: { key: 'value-10' } },
          ru: { common: { key: 'value-10' }, extra: { key: 'value-10' } },
        },
        [CACHE_TRANSLATIONS_DEFAULT_FILE]: {
          en: { common: { key: 'value-10' }, extra: { key: 'value-10' } },
        },
        [CACHE_NAMESPACES_FILE]: ['common', 'extra'],
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `common.json`)]: {
          key: 'value-10',
        },
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'ru', `common.json`)]: {
          key: 'value-10',
        },
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'en', `extra.json`)]: {
          key: 'value-10',
        },
        [path.resolve(PUBLIC_TRANSLATIONS_DIR, 'ru', `extra.json`)]: {
          key: 'value-10',
        },
      }

      const translations = await aggregateTranslations(nodes, options)
      expect(translations).toStrictEqual(expected)
    })
  })
})
