import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { withRouter } from 'react-router'
import { Icon } from 'hbm-react-components'
import classNames from 'classnames'
import StateAndMethodList from './StateAndMethodList'

class Group extends React.Component {
  updateFetch (groups, nextGroup) {
    let group = {...groups.find(group => group.title === nextGroup)}
    if (!group) {
      return
    }
    if (!this.fetching || this.lastGroup !== nextGroup) {
      this.lastGroup = nextGroup
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
    const {statesAndMethods, toggleFavorite, favorites, children} = this.props

    const createStar = (path) => {
      return <Icon.Star
        onClick={() => toggleFavorite(path)}
        className={classNames('Icon Fetch Star', {'Star--active': (favorites.indexOf(path) > -1)})}
      />
    }

    return (
      <div className='Split'>
        <div className='Split-left'>
          <StateAndMethodList statesAndMethods={statesAndMethods} iconCreator={createStar} onSelect={this.onSelect} />
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
    groups: state.data.groups,
    favorites: state.settings.favorites,
    statesAndMethods: state.data.group,
    connection: state.settings.connection
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Group))
