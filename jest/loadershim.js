global.___loader = {
  enqueue: jest.fn(),
}

global.___navigate = jest.fn()

console.error = err => {
  throw new Error(`console.error: ${err}`)
}

// console.warn = warning => {
//   throw new Error(`console.warn: ${warning}`)
// }
