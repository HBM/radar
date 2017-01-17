import React from 'react'
import { List, Row } from 'md-components'
import flatten from 'flat'
import deepEqual from 'deep-equal'
import { connect } from 'react-redux'

const methodAvatar = <span className='Method-avatar'>M</span>

const createMethodRow = (method, icon, link) => (
  <Row
    onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
    avatar={methodAvatar}
    primary={method.path}
    secondary='Method'
    icon={icon}
    key={method.path}
    linkTo={link}
	/>
)

const stateAvatar = <span className='State-avatar'>S</span>

const createStateRow = (state, icon, link, fields) => {
  let content
  let contentEmpty
  if (typeof state.value === 'object') {
    const flat = flatten(state.value)
    fields = fields || []
    if (fields.length === 0) {
      fields = Object.keys(flat).slice(0, 3)
    }
    content = fields.map(field => {
      return flat[field] !== undefined ? <span className='State-field' key={field} >
        <span className='State-field-name'>{field}:</span>
        <span className='State-field-value'>{JSON.stringify(flat[field])}</span>
      </span> : null
    })
    contentEmpty = content.find(child => child !== null) === undefined
  } else {
    content = <span className='State-field'><span className='State-field-value'>{JSON.stringify(state.value)}</span></span>
    contentEmpty = false
  }
  return (
    <Row
      onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
      avatar={stateAvatar}
      primary={state.path}
      secondary={contentEmpty ? 'No matching fields' : content}
      icon={icon}
      linkTo={link}
    />
  )
}

class StateOrMethod_ extends React.Component {
  shouldComponentUpdate (nextProps) {
    const path = nextProps.stateOrMethod.path
    if (nextProps.favorites.indexOf(path) > -1 !== this.props.favorites.indexOf(path) > -1) {
      return true
    }
    return !deepEqual(nextProps.stateOrMethod, this.props.stateOrMethod) || nextProps.favorites !== this.props.favorites
  }

  render () {
    const {stateOrMethod, iconCreator, rootPath, selectedFields} = this.props
    if (typeof stateOrMethod.value === 'undefined') {
      const method = stateOrMethod
      return createMethodRow(method, iconCreator(method.path), rootPath + '/' + encodeURIComponent(method.path))
    } else {
      const state = stateOrMethod
      return createStateRow(state, iconCreator(state.path), rootPath + '/' + encodeURIComponent(state.path), selectedFields)
    }
  }
}

const mapStateToFavorites = state => ({
  favorites: state.settings.favorites
})

const StateOrMethod = connect(mapStateToFavorites)(StateOrMethod_)

class StateAndMethodList extends React.Component {
  shouldComponentUpdate (nextProps) {
    if (nextProps.selectedFields !== this.props.selectedFields ||
        nextProps.rootPath !== this.props.rootPath ||
        nextProps.favorites !== this.props.favorites) {
      return true
    }
    return false
  }

  componentWillUnmount () {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      delete this.debounceTimer
    }
  }

  componentWillReceiveProps () {
    if (!this.debounceTimer) {
      this.debounceTimer = setTimeout(() => {
        this.forceUpdate()
        delete this.debounceTimer
      }, 100)
    }
  }

  render () {
    const {statesAndMethods, iconCreator = () => {}, rootPath, selectedFields} = this.props
    const rows = statesAndMethods
      .sort((a, b) => {
        if (a.path < b.path) {
          return -1
        }
        if (a.path > b.path) {
          return 1
        }
        return 0
      })
      .map(stateOrMethod => <StateOrMethod key={stateOrMethod.path} stateOrMethod={stateOrMethod} iconCreator={iconCreator} selectedFields={selectedFields} rootPath={rootPath} />)

    return (
      <List>
        {rows}
      </List>
    )
  }
}

export default connect(mapStateToFavorites)(StateAndMethodList)
