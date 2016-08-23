import React from 'react'
import { List, Row } from 'hbm-react-components'

const methodAvatar = <span className='Method-avatar'>M</span>

const createMethodRow = (method, icon) => (
  <Row
    avatar={methodAvatar}
    primary={method.path}
    secondary='Method'
    icon={icon}
    key={method.path}
	/>
)

const stateAvatar = <span className='State-avatar'>S</span>

const createStateRow = (state, icon) => (
  <Row
    avatar={stateAvatar}
    primary={state.path}
    secondary={'State / ' + JSON.stringify(state.value)}
    icon={icon}
    key={state.path}
	/>
)

const StateAndMethodList = ({states, methods, iconCreator}) => {
  const stateRows = states.map((state) => {
    return createStateRow(state, iconCreator(state.path))
  })

  const methodRows = methods.map((method) => {
    return createMethodRow(method, iconCreator(method.path))
  })

  const rows = methodRows.concat(stateRows).sort(function (rowA, rowB) {
    return rowA.props.primary - rowB.props.primary
  })

  return (
    <List>
      {rows}
    </List>
  )
}

export default StateAndMethodList
