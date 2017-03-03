import React from 'react'
import { List } from 'md-components'
import MethodRow from './MethodRow'
import StateRow from './StateRow'

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
}

export default StateAndMethodList

