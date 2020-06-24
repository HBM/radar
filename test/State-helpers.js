/* globals describe it */
import assert from 'assert'
import { flatObject, unflatObject, toHex, flatToNameValue, isInt } from '../src/components/State/helpers'

describe('State helpers', () => {
  describe('flatObject', () => {
    it('should flatten object', () => {
      assert.deepStrictEqual(flatObject({
        a: {
          b: {
            c: [1, 2]
          },
          x: 'foo'
        }
      }), {
        'a.b.c.0': 1,
        'a.b.c.1': 2,
        'a.x': 'foo'
      })
    })

    it('should put primitive type in object with key <empty string>', () => {
      assert.deepStrictEqual(flatObject(123), { '': 123 })
    })
  })

  describe('unflatObject', () => {
    it('should unflatten object', () => {
      assert.deepStrictEqual(unflatObject({
        'a.b.c.0': 1,
        'a.b.c.1': 2,
        'a.x': 'foo'
      }), {
        a: {
          b: {
            c: [1, 2]
          },
          x: 'foo'
        }
      })
    })

    it('should unflat <empty string> key to primitive type', () => {
      assert.deepStrictEqual(unflatObject({ '': 123 }), 123)
    })
  })

  describe('toHex', () => {
    it('should convert -1 -> "0x 00 00 00 01"', () => {
      assert.strictEqual(toHex(1), '0x 00 00 00 01')
    })

    it('should convert -1 -> "0x 00 00 00 01"', () => {
      assert.strictEqual(toHex(-1), '0x 00 00 00 01')
    })

    it('should convert 4294967295 -> "0x ff ff ff ff"', () => {
      assert.strictEqual(toHex(4294967295), '0x ff ff ff ff')
    })

    it('should convert -4294967295 -> "0x ff ff ff ff"', () => {
      assert.strictEqual(toHex(-4294967295), '0x ff ff ff ff')
    })
  })

  describe('flatToNameValue', () => {
    it('should return {name, value} pairs', () => {
      const nvps = flatToNameValue({ z: 123, b: 4, c: 5 })
      assert.deepStrictEqual(nvps, [
        { name: 'b', value: 4 },
        { name: 'c', value: 5 },
        { name: 'z', value: 123 }
      ])
    })
  })

  describe('isInt', () => {
    it('should return true for 127', () => {
      assert.strictEqual(isInt(127), true)
    })

    it('should return true for 1.0', () => {
      assert.strictEqual(isInt(1.0), true)
    })

    it('should return true for -3', () => {
      assert.strictEqual(isInt(-3), true)
    })

    it('should return false for 1.3', () => {
      assert.strictEqual(isInt(1.3), false)
    })

    it('should return false for 1.000000001', () => {
      assert.strictEqual(isInt(1.000000001), false)
    })
  })
})
