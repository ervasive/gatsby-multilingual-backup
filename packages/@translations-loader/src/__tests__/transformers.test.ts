import { transformJSON, transformYAML } from '../transformers'

describe('transformers', () => {
  describe('transformJSON', () => {
    it('should conform to the Transformer shape', () => {
      expect(transformJSON.type).toBe('application/json')
      expect(typeof transformJSON.handler).toBe('function')
    })

    it('should throw on invalid content', () => {
      expect(() => transformJSON.handler('invalid JSON')).toThrow()
    })

    it('should return JSON string on valid input', () => {
      expect(transformJSON.handler('{"val": "key"}')).toBe('{"val":"key"}')
    })
  })

  describe('transformYAML', () => {
    it('should conform to the Transformer shape', () => {
      expect(transformYAML.type).toBe('text/yaml')
      expect(typeof transformYAML.handler).toBe('function')
    })

    it('should throw on invalid content', () => {
      expect(() => transformYAML.handler('- val\nhello')).toThrow()
    })

    it('should return JSON string on valid input', () => {
      expect(transformYAML.handler('val: key')).toBe('{"val":"key"}')
    })
  })
})
