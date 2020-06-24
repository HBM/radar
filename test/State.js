/* globals describe it beforeEach */
import State from '../src/components/State'
import assert from 'assert'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

describe('State', () => {
  const TestContainer = (props) => {
    const location = { pathname: '', search: '', hash: '' }
    return (
      <MemoryRouter initialEntries={[location]}>
        <State {...this.props} backUrl='' />
      </MemoryRouter>
    )
  }

  it('should mount', () => {
    mount(<TestContainer state={{ path: 'foo', value: 123 }} />)
  })

  it('should render Textfield label="" for primitive types', () => {
    const wrapper = mount(<TestContainer state={{ path: 'foo', value: 'asd' }} />)
    assert.strictEqual(wrapper.find('.Textfield-label').text(), '')
  })

  it('should render a Textfield with respective "flat" label each in alphabetical order', () => {
    const value = {
      foo: 'asd',
      bar: ['bar', 'pop']
    }
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    assert.strictEqual(wrapper.find('.Textfield').length, 3)
    assert.strictEqual(wrapper.find('.Textfield-label').at(0).text(), 'bar.0')
    assert.strictEqual(wrapper.find('.Textfield-label').at(1).text(), 'bar.1')
    assert.strictEqual(wrapper.find('.Textfield-label').at(2).text(), 'foo')
  })

  it('should render bool as Checkbox', () => {
    const value = {
      foo: true
    }
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    assert.strictEqual(wrapper.find('.Checkbox-label').text(), 'foo')
    assert.strictEqual(wrapper.find('.Checkbox input').node.checked, true)
  })

  it('should render integer with additional "as Hex" Textfield', () => {
    const value = {
      foo: 1
    }
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    assert.strictEqual(wrapper.find('.Textfield-label').at(0).text(), 'foo')
    assert.strictEqual(wrapper.find('.Textfield input').at(0).node.value, '1')
    assert.strictEqual(wrapper.find('.Textfield-label').at(1).text(), 'As HEX')
    assert.strictEqual(wrapper.find('.Textfield input').at(1).node.value, '0x 00 00 00 01')
    assert.strictEqual(wrapper.find('.Textfield input').at(1).node.disabled, true)
  })

  it('should render cancel and set button', () => {
    const value = 123
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    assert.strictEqual(wrapper.find('button.Button').at(1).text(), 'Cancel')
    assert.strictEqual(wrapper.find('button.Button').at(0).text(), 'Set')
  })

  it('should disable cancel and set button per default', () => {
    const value = 123
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    assert.strictEqual(wrapper.find('button.Button').at(0).node.disabled, true)
    assert.strictEqual(wrapper.find('button.Button').at(1).node.disabled, true)
  })

  it('should update value', () => {
    const value = 123.2
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.2')
    wrapper.setProps({ state: { path: 'foo', value: 123.3 } })
    assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.3')
  })

  describe('with local changes', () => {
    let wrapper
    const initialValue = 123.2

    beforeEach(() => {
      wrapper = mount(<TestContainer state={{ path: 'foo', value: initialValue }} />)
      wrapper.find('.Textfield input').simulate('change', {
        target: {
          value: '123.3'
        }
      })
    })

    it('should render change', () => {
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.3')
    })

    it('should enable cancel and set button', () => {
      assert.strictEqual(wrapper.find('button.Button').at(0).node.disabled, false)
      assert.strictEqual(wrapper.find('button.Button').at(1).node.disabled, false)
    })

    it('should reset with cancel button press', () => {
      wrapper.find('button.Button').at(1).simulate('click')
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.2')
      assert.strictEqual(wrapper.find('button.Button').at(0).node.disabled, true)
      assert.strictEqual(wrapper.find('button.Button').at(1).node.disabled, true)
    })

    it('should reset when inputting initial value', () => {
      wrapper.find('.Textfield input').simulate('change', {
        target: {
          value: '123.2'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.2')
      assert.strictEqual(wrapper.find('button.Button').at(0).node.disabled, true)
      assert.strictEqual(wrapper.find('button.Button').at(1).node.disabled, true)
    })
  })

  it('should enable cancel button on error', () => {
    const value = 123.2
    const wrapper = mount(<TestContainer state={{ path: 'foo', value }} />)
    wrapper.find('.Textfield input').simulate('change', {
      target: {
        value: '12a3.2'
      }
    })
    assert.strictEqual(wrapper.find('button.Button').at(0).node.disabled, true)
    assert.strictEqual(wrapper.find('button.Button').at(1).node.disabled, false)
  })
})
