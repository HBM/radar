import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { withRouter } from 'react-router'
import StateAndMethodList from './StateAndMethodList'

class Group extends React.Component {
  updateFetch (groups, nextGroup) {
    let group = {...groups.find(group => group.title === nextGroup)}
    if (!group) {
      return
    }
    if (!this.fetching || this.lastGroup !== nextGroup) {
      this.lastGroup = nextGroup
      group.expression.sort = {...group.expression.sort, asArray: true}
      let sort = group.expression.sort
      if (!sort.byPath && !sort.byValue && !sort.byValueField) {
        group.expression.sort.byPath = true
      }
      sort.from = sort.from || 1
      sort.to = sort.to || 1000
      this.props.unfetch(this.props.connection, 'group')
      this.props.fetch(this.props.connection, group.expression, 'group')
      this.fetching = true
    }
  }

  componentWillMount () {
    if (!this.props.groups) {
      return
    }
    this.updateFetch(this.props.groups, decodeURIComponent(this.props.params.group))
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.groups) {
      return
    }
    this.updateFetch(nextProps.groups, decodeURIComponent(nextProps.params.group))
  }

  componentWillUnmount () {
    this.props.unfetch(this.props.connection, 'group')
    this.fetching = false
  }

  onSelect = (stateOrMethod) => {
    this.props.router.push('/groups/' + encodeURIComponent(this.props.params.group) + '/' + encodeURIComponent(stateOrMethod.path))
  }

  render () {
    const {children, statesAndMethods} = this.props

    return (
      <div className='Split'>
        <div className='Split-left'>
          <StateAndMethodList statesAndMethods={statesAndMethods} onSelect={this.onSelect} />
        </div>
        <div className='Split-right'>
          {children && React.cloneElement(children, {statesAndMethods})}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.data.groups._radarGroups,
    statesAndMethods: state.data.group,
    connection: state.settings.connection
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Group))
