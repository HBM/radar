/* globals describe it before */
import MethodRow from '../src/components/StateAndMethodList/MethodRow'
import StateRow from '../src/components/StateAndMethodList/StateRow'
import StateAndMethodList from '../src/components/StateAndMethodList'
import assert from 'assert'
import {mount} from 'enzyme'
import {Broadcast} from 'react-broadcast'
import React from 'react'

describe('StateAndMethodList', () => {
  describe('MethodRow', () => {
    const props = {
      method: {
        path: 'foo'
      },
      link: 'bar',
      icon: 'pop'
    }

    it('should mount', () => {
      const location = {pathname: '', search: '', hash: ''}
      mount(
        <Broadcast channel='location' value={location}>
          <MethodRow {...props} />
        </Broadcast>
      )
    })

    describe('when mounted', () => {
      let wrapper

      before(() => {
        const location = {pathname: '', search: '', hash: ''}
        wrapper = mount(
          <Broadcast channel='location' value={location}>
            <MethodRow {...props} />
          </Broadcast>
        )
      })

      it('should render <path> prop as primary', () => {
        assert.equal(wrapper.find('.List-row-text-primary').text(), props.method.path)
      })

      it('should render "Method" as primary', () => {
        assert.equal(wrapper.find('.List-row-text-secondary').text(), 'Method')
      })

      it('should render the link prop with correct href', () => {
        assert.equal(wrapper.find('a').length, 1)
        assert.equal(wrapper.find('a').at(0).node.href, props.link)
      })

      it('should render "M" as avatar', () => {
        assert.equal(wrapper.find('.List-row-avatar').text(), 'M')
      })

      it('should render the icon prop', () => {
        assert.equal(wrapper.find('.List-row-icon-right').text(), props.icon)
      })
    })
  })

  describe('StateRow', () => {
    const props = {
      state: {
        path: 'foo',
        value: {
          this: 123,
          that: 333
        }
      },
      link: 'bar',
      icon: 'pop'
    }

    it('should mount', () => {
      const location = {pathname: '', search: '', hash: ''}
      mount(
        <Broadcast channel='location' value={location}>
          <StateRow {...props} />
        </Broadcast>
      )
    })

    describe('when mounted', () => {
      let wrapper

      before(() => {
        const location = {pathname: '', search: '', hash: ''}
        wrapper = mount(
          <Broadcast channel='location' value={location}>
            <StateRow {...props} fields={['this']} />
          </Broadcast>
        )
      })

      it('should render <path> prop as primary', () => {
        assert.equal(wrapper.find('.List-row-text-primary').text(), props.state.path)
      })

      it('should render the state filtered with fields prop as primary', () => {
        assert.equal(wrapper.find('.List-row-text-secondary').text(), 'this:123')
      })

      it('should render the link prop with correct href', () => {
        assert.equal(wrapper.find('a').length, 1)
        assert.equal(wrapper.find('a').at(0).node.href, props.link)
      })

      it('should render "S" as avatar', () => {
        assert.equal(wrapper.find('.List-row-avatar').text(), 'S')
      })

      it('should render the icon prop', () => {
        assert.equal(wrapper.find('.List-row-icon-right').text(), props.icon)
      })
    })

    it('should render max 3 fields as secondary', () => {
      const location = {pathname: '', search: '', hash: ''}
      const propsBig = {...props, state: {...props.state}}
      propsBig.state.value = {a: 1, b: 2, c: 3, d: 4}
      const wrapper = mount(
        <Broadcast channel='location' value={location}>
          <StateRow {...propsBig} />
        </Broadcast>
      )

      assert.equal(wrapper.find('.List-row-text-secondary .State-field').length, 3)
    })

    it('should render "No matching fields" if not field matches', () => {
      const location = {pathname: '', search: '', hash: ''}
      const propsBig = {...props, state: {...props.state}}
      propsBig.state.value = {a: 1, b: 2, c: 3, d: 4}
      const wrapper = mount(
        <Broadcast channel='location' value={location}>
          <StateRow {...propsBig} fields={['baz']} />
        </Broadcast>
      )

      assert.equal(wrapper.find('.List-row-text-secondary').text(), 'No matching fields')
    })

    it('should render primitive types regardless of the field prop', () => {
      const location = {pathname: '', search: '', hash: ''}
      const propsBig = {...props, state: {...props.state}}
      propsBig.state.value = 333
      const wrapper = mount(
        <Broadcast channel='location' value={location}>
          <StateRow {...propsBig} fields={['baz']} />
        </Broadcast>
      )

      assert.equal(wrapper.find('.List-row-text-secondary').text(), '333')
    })
  })

  const statesAndMethods = [
    {
      path: 'foo',
      value: 123
    },
    {
      path: 'bar'
    }
  ]

  class TestContainer extends React.PureComponent {
    location = {pathname: '', search: '', hash: ''}
    render () {
      return (
        <Broadcast channel='location' value={this.location}>
          <StateAndMethodList {...this.props} />
        </Broadcast>
      )
    }
  }

  it('should mount', () => {
    const props = {
      statesAndMethods,
      rootPath: '/test',
      selectedFields: ['this']
    }
    mount(<TestContainer {...props} />)
  })

  it('should unmount with pending debounceTimer', () => {
    const props = {
      statesAndMethods,
      rootPath: '/test',
      selectedFields: ['this']
    }
    const wrapper = mount(<TestContainer {...props} />)
    wrapper.setProps({statesAndMethods: []})
    wrapper.unmount()
  })

  it('should unmount without pending debounceTimer', () => {
    const props = {
      statesAndMethods,
      rootPath: '/test',
      selectedFields: ['this']
    }
    const wrapper = mount(<TestContainer {...props} />)
    wrapper.unmount()
  })

  it('should render rootPath prop changes immediatly', () => {
    const props = {
      statesAndMethods,
      rootPath: '/test',
      selectedFields: ['this']
    }
    const wrapper = mount(<TestContainer {...props} />)
    const getFirstLinkHref = () => wrapper.find('a').at(0).node.href
    assert(!getFirstLinkHref().match('abcdefg'))
    wrapper.setProps({rootPath: 'abcdefg'})
    assert(getFirstLinkHref().match('abcdefg'))
  })

  it('should render statesAndMethods prop changes after 100ms', done => {
    const props = {
      statesAndMethods,
      rootPath: '/test',
      selectedFields: ['this']
    }
    const wrapper = mount(<TestContainer {...props} />)
    assert.equal(wrapper.find('.List-row').length, 2)
    wrapper.setProps({statesAndMethods: []})
    assert.equal(wrapper.find('.List-row').length, 2)
    setTimeout(() => {
      assert.equal(wrapper.find('.List-row').length, 0)
      done()
    }, 101)
  })
})
