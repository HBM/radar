/* globals describe it */
import assert from 'assert'
import {flatObject, unflatObject, toHex, flatToNameValue, isInt} from '../src/components/State/helpers'

describe('State helpers', () => {
  describe('flatObject', () => {
    it('should flatten object', () => {
      assert.deepEqual(flatObject({
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
      assert.deepEqual(flatObject(123), {'': 123})
    })
  })

  describe('unflatObject', () => {
    it('should unflatten object', () => {
      assert.deepEqual(unflatObject({
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
      assert.deepEqual(unflatObject({'': 123}), 123)
    })
  })

  describe('toHex', () => {
    it('should convert -1 -> "0x 00 00 00 01"', () => {
      assert.equal(toHex(1), '0x 00 00 00 01')
    })

    it('should convert -1 -> "0x 00 00 00 01"', () => {
      assert.equal(toHex(-1), '0x 00 00 00 01')
    })

    it('should convert 4294967295 -> "0x ff ff ff ff"', () => {
      assert.equal(toHex(4294967295), '0x ff ff ff ff')
    })

    it('should convert -4294967295 -> "0x ff ff ff ff"', () => {
      assert.equal(toHex(-4294967295), '0x ff ff ff ff')
    })
  })

  describe('flatToNameValue', () => {
    it('should return {name, value} pairs', () => {
      const nvps = flatToNameValue({z: 123, b: 4, c: 5})
      assert.deepEqual(nvps, [
        {name: 'b', value: 4},
        {name: 'c', value: 5},
        {name: 'z', value: 123}
      ])
    })
  })

  describe('isInt', () => {
    it('should return true for 127', () => {
      assert.equal(isInt(127), true)
    })

    it('should return true for 1.0', () => {
      assert.equal(isInt(1.0), true)
    })

    it('should return true for -3', () => {
      assert.equal(isInt(-3), true)
    })

    it('should return false for 1.3', () => {
      assert.equal(isInt(1.3), false)
    })

    it('should return false for 1.000000001', () => {
      assert.equal(isInt(1.000000001), false)
    })
  })
})
