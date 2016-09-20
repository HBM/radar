import React from 'react'
import { List, Row, Radiobutton, Select, Icon } from 'md-components'
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
  fields = fields || Object.keys(flat).slice(0, 3)
  const content = fields.map(field => {
    return <span className='State-field'>
      <span className='State-field-name'>{field}:</span>
      <span className='State-field-value'>{JSON.stringify(flat[field])}</span>
    </span>
  })
  return (
    <Row
      onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
      avatar={stateAvatar}
      primary={state.path}
      secondary={content}
      icon={icon}
      key={state.path}
      linkTo={link}
    />
  )
}

const StateAndMethodList = ({statesAndMethods, iconCreator = () => {}, rootPath}) => {
  const fieldsObj = statesAndMethods
    .map(state => Object.keys(flatten(state.value || {})))
    .reduce((pre, fields) => {
      fields.forEach(field => {
        pre[field] = true
      })
      return pre
    }, {})
  const fields = Object.keys(fieldsObj)
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
        return createStateRow(state, iconCreator(state.path), rootPath + '/' + encodeURIComponent(state.path), fields)
      }
    })

  return (
    <div>
      <div style={{padding: '10px 24px'}}>
        <Icon.Filter />
      </div>
      <List>
        {rows}
      </List>
    </div>
  )
}

export default StateAndMethodList
