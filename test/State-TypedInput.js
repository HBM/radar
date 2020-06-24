/* globals describe it */
import TypedInput from '../src/components/State/TypedInput'
import assert from 'assert'
import { mount } from 'enzyme'

describe('State - TypedInput', () => {
  describe('with value=<boolean>', () => {
    const val = true
    const boolTI = <TypedInput name='foo' label='bar' value={val} />

    it('should mount without throw', () => {
      mount(boolTI)
    })

    it('should render as Checkbox', () => {
      const wrapper = mount(boolTI)
      assert.strictEqual(wrapper.find('.Checkbox').length, 1)
    })

    it('should render input with correct value', () => {
      const wrapper = mount(boolTI)
      assert.strictEqual(wrapper.find('.Checkbox input').node.checked, true)
    })

    it('should render input with correct label', () => {
      const wrapper = mount(boolTI)
      assert(wrapper.find('.Checkbox').text().match('bar'))
    })

    it('should update value', () => {
      const wrapper = mount(boolTI)
      wrapper.setProps({ value: false })
      assert.strictEqual(wrapper.find('.Checkbox input').node.checked, false)
    })

    it('should call onChange(<name>, <number>)', () => {
      let onChangeArguments
      const onChange = (...args) => {
        onChangeArguments = args
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value={val} onChange={onChange} onError={() => {}} />)
      wrapper.instance().onChange({
        target: {
          checked: false
        }
      })
      assert.deepStrictEqual(onChangeArguments, ['foo', false])
    })
  })

  describe('with value=<string>', () => {
    const stringTI = <TypedInput name='foo' label='bar' value='pop' />

    it('should mount without throw', () => {
      mount(stringTI)
    })

    it('should render as Textfield', () => {
      const wrapper = mount(stringTI)
      assert.strictEqual(wrapper.find('.Textfield').length, 1)
    })

    it('should render input with correct value', () => {
      const wrapper = mount(stringTI)
      assert.strictEqual(wrapper.find('.Textfield input[value="pop"]').length, 1)
    })

    it('should render input with correct label', () => {
      const wrapper = mount(stringTI)
      assert(wrapper.find('.Textfield').text().match('bar'))
    })

    it('should update value', () => {
      const wrapper = mount(stringTI)
      wrapper.setProps({ value: 'kip' })
      assert.strictEqual(wrapper.find('.Textfield input[value="kip"]').length, 1)
    })

    it('should call onChange(<name>, <number>)', () => {
      let onChangeArguments
      const onChange = (...args) => {
        onChangeArguments = args
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value='pop' onChange={onChange} onError={() => {}} />)
      wrapper.instance().onChange({
        target: {
          value: 'kip'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, 'kip')
      assert.deepStrictEqual(onChangeArguments, ['foo', 'kip'])
    })
  })

  describe('with value=<number>', () => {
    const numberTI = <TypedInput name='foo' label='bar' value={123} />

    it('should mount without throw', () => {
      mount(numberTI)
    })

    it('should render as Textfield', () => {
      const wrapper = mount(numberTI)
      assert.strictEqual(wrapper.find('.Textfield').length, 1)
    })

    it('should render input with correct value', () => {
      const wrapper = mount(numberTI)
      assert.strictEqual(wrapper.find('.Textfield input[value=123]').length, 1)
    })

    it('should render input with correct label', () => {
      const wrapper = mount(numberTI)
      assert(wrapper.find('.Textfield').text().match('bar'))
    })

    it('should update value', () => {
      const wrapper = mount(numberTI)
      wrapper.setProps({ value: 333 })
      assert.strictEqual(wrapper.find('.Textfield input[value=333]').length, 1)
    })

    it('should call onChange(<name>, <number>)', () => {
      let onChangeArguments
      const onChange = (...args) => {
        onChangeArguments = args
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value={123} onChange={onChange} onError={() => {}} />)
      wrapper.instance().onChange({
        target: {
          value: '342'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '342')
      assert.deepStrictEqual(onChangeArguments, ['foo', 342])
    })

    it('should render but not call onChange when ending with dot', () => {
      let onChangeCalled = false
      const onChange = () => {
        onChangeCalled = true
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value={123} onChange={onChange} onError={() => {}} />)
      wrapper.instance().onChange({
        target: {
          value: '123.'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.')
      assert.strictEqual(onChangeCalled, false)
    })

    it('should render "Not a number" error', () => {
      let onErrorArguments
      const onError = (...args) => {
        onErrorArguments = args
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value={123} onError={onError} onChange={() => {}} />)
      wrapper.instance().onChange({
        target: {
          value: '123.a'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.a')
      assert.strictEqual(wrapper.find('.Textfield-error').text(), 'Not a number')
      assert.deepStrictEqual(onErrorArguments, ['foo', true])
    })

    it('should render "Not a number" error 2', () => {
      let onErrorArguments
      const onError = (...args) => {
        onErrorArguments = args
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value={123} onError={onError} onChange={() => {}} />)
      wrapper.instance().onChange({
        target: {
          value: '12a3.2'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '12a3.2')
      assert.strictEqual(wrapper.find('.Textfield-error').text(), 'Not a number')
      assert.deepStrictEqual(onErrorArguments, ['foo', true])
    })

    it('should reset error', () => {
      let onErrorArguments
      const onError = (...args) => {
        onErrorArguments = args
      }
      const wrapper = mount(<TypedInput name='foo' label='bar' value={123} onError={onError} onChange={() => {}} />)
      wrapper.instance().onChange({
        target: {
          value: '123.a'
        }
      })
      wrapper.instance().onChange({
        target: {
          value: '123.'
        }
      })
      assert.strictEqual(wrapper.find('.Textfield input').node.value, '123.')
      assert.strictEqual(wrapper.find('.Textfield-error').text(), '')
      assert.deepStrictEqual(onErrorArguments, ['foo', false])
    })
  })
})
