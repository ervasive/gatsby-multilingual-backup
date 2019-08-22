export default (path: string): string => {
  const multiSlashRe = /\/+/g
  const indexRe = /\/index(\/)*$/i
  const newPath = path.replace(indexRe, '').replace(multiSlashRe, '/')

  return newPath === '' ? '/' : newPath
}
