import React from 'react'
import { List, Row } from 'md-components'

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

const createStateRow = (state, icon, link) => {
  return (
    <Row
      onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
      avatar={stateAvatar}
      primary={state.path}
      secondary={'State / ' + JSON.stringify(state.value)}
      icon={icon}
      key={state.path}
      linkTo={link}
    />
  )
}

const StateAndMethodList = ({statesAndMethods, iconCreator = () => {}, rootPath}) => {
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
        return createStateRow(state, iconCreator(state.path), rootPath + '/' + encodeURIComponent(state.path))
      }
    })

  return (
    <List>
      {rows}
    </List>
  )
}

export default StateAndMethodList
