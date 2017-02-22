/* globals describe it */
import assert from 'assert'
import {flatObject} from '../src/components/State'

describe('State component', () => {
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
})
