import { outputJSON, emptyDir } from 'fs-extra'
import {
  CACHE_DIR,
  CACHE_PAGES_FILE,
  CACHE_NAMESPACES_FILE,
  CACHE_TRANSLATIONS_ALL_FILE,
  CACHE_TRANSLATIONS_DEFAULT_FILE,
} from './constants'

export default async (): Promise<void> => {
  await emptyDir(CACHE_DIR)
  await outputJSON(CACHE_PAGES_FILE, {})
  await outputJSON(CACHE_NAMESPACES_FILE, [])
  await outputJSON(CACHE_TRANSLATIONS_ALL_FILE, {})
  await outputJSON(CACHE_TRANSLATIONS_DEFAULT_FILE, {})
}
