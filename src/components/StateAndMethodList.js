import React from 'react'
import { List, Row } from 'md-components'
import flatten from 'flat'

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
  const flat = flatten(state.value)
  fields = fields || []
  if (fields.length === 0) {
    fields = Object.keys(flat).slice(0, 3)
  }
  const content = fields.map(field => {
    return flat[field] !== undefined ? <span className='State-field' key={field} >
      <span className='State-field-name'>{field}:</span>
      <span className='State-field-value'>{JSON.stringify(flat[field])}</span>
    </span> : null
  })
  return (
    <Row
      onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
      avatar={stateAvatar}
      primary={state.path}
      secondary={content[0] && content || 'No matching fields'}
      icon={icon}
      key={state.path}
      linkTo={link}
    />
  )
}

class StateAndMethodList extends React.Component {
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
      .map((stateOrMethod) => {
        if (typeof stateOrMethod.value === 'undefined') {
          const method = stateOrMethod
          return createMethodRow(method, iconCreator(method.path), rootPath + '/' + encodeURIComponent(method.path))
        } else {
          const state = stateOrMethod
          return createStateRow(state, iconCreator(state.path), rootPath + '/' + encodeURIComponent(state.path), selectedFields)
        }
      })

    return (
      <List>
        {rows}
      </List>
    )
  }
}

export default StateAndMethodList
