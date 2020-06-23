import React from 'react'
import { List } from 'md-components'
import MethodRow from './MethodRow'
import StateRow from './StateRow'

const StateAndMethodList = (props) => {
  const {statesAndMethods, iconCreator = () => {}, rootPath, selectedFields} = props
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
    .map(stateOrMethod => {
      const rowProps = {
        key: stateOrMethod.path,
        icon: iconCreator(stateOrMethod.path),
        link: rootPath + '/' + encodeURIComponent(stateOrMethod.path)
      }
      return typeof stateOrMethod.value === 'undefined'
        ? <MethodRow method={stateOrMethod} {...rowProps} />
        : <StateRow state={stateOrMethod} fields={selectedFields} {...rowProps} />
    })

  return (
    <List>
      {rows}
    </List>
  )
}

export default StateAndMethodList

