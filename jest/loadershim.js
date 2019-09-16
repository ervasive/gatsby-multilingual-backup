global.___loader = {
  enqueue: jest.fn(),
}

global.___navigate = jest.fn()

console.error = err => {
  throw new Error(err)
}

console.warn = warning => {
  throw new Error(warning)
}
