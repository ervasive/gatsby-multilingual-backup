const fs = require('fs')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

const rootPath = path.resolve(__dirname, '..')
const basePath = path.resolve(rootPath, 'e2e-tests')

fs.readdirSync(basePath).forEach(suite => {
  const suitePath = path.join(basePath, suite)
  const packageFilePath = path.join(suitePath, 'package.json')
  const specsPath = path.join(suitePath, 'specs')

  // ensure directory contains package.json file and "specs" directory
  if (!fs.existsSync(packageFilePath) || !fs.existsSync(specsPath)) return

  const { name, ignoreSuite } = require(packageFilePath)

  // should this suite be ignored?
  if (ignoreSuite) return

  console.log(`--------------------------------------------------`)
  console.log(`Run: "${name}" suite`)
  console.log(`--------------------------------------------------`)
  const { status: buildStatus } = spawnSync(
    'yarn',
    ['workspace', name, 'build'],
    {
      env: process.env,
      cwd: rootPath,
      stdio: 'inherit',
    },
  )

  if (buildStatus !== 0) process.exit(1)

  const serve = spawn('yarn', ['workspace', name, 'serve'], {
    env: process.env,
    cwd: rootPath,
  })

  const options = [
    `screenshotsFolder=${path.resolve(
      __dirname,
      'cypress',
      'screenshots',
      suite,
    )}`,
    `videosFolder=${path.resolve(__dirname, 'cypress', 'videos', suite)}`,
    `integrationFolder=${suitePath}/specs`,
  ]

  const { status: testStatus } = spawnSync(
    'yarn',
    [`cypress`, `run`, `--config`, options.join(',')],
    {
      env: process.env,
      cwd: rootPath,
      stdio: 'inherit',
      shell: '/bin/sh',
    },
  )

  serve.kill()

  if (testStatus !== 0) process.exit(1)
})

console.log(`--------------------------------------------------`)
console.log(`All done.`)
console.log(`--------------------------------------------------`)
process.exit()
