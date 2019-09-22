import { spawnSync } from 'child_process'

describe(`Invalid translations file`, () => {
  it(`should issue a warning into the stdout`, () => {
    const { stdout, status } = spawnSync(`lerna`, [
      'run',
      'develop',
      '--scope=e2e-invalid-translation',
      '--stream',
    ])

    expect(status).toBe(0)
    expect(stdout.toString()).toMatch(
      /there was an error validating one of the translations files/is,
    )
  })
})
