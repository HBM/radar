import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { List, Row, Icon } from 'hbm-react-components'

class Favorites extends React.Component {
  constructor (props) {
    super(props)
    this.props.changeFetcher({
      equalsOneOf: this.props.favorites
    })
  }

  render () {
    const {states, methods, removeFavorite, favorites} = this.props

    const createClear = (path) => {
      return <Icon.Clear
        onClick={() => removeFavorite(path)}
        className='Icon'
        />
    }

    const stateAvatar = <span className='State-avatar'>S</span>
    const stateRows = states
      .filter((state) => favorites.indexOf(state.path) > -1)
      .map((state) => {
        return <Row
          avatar={stateAvatar}
          primary={state.path}
          secondary={'State / ' + JSON.stringify(state.value)}
          icon={createClear(state.path)}
          key={state.path}
		/>
      })

    const methodAvatar = <span className='Method-avatar'>M</span>
    const methodRows = methods
      .filter((method) => favorites.indexOf(method.path) > -1)
      .map((method) => {
        return <Row
          avatar={methodAvatar}
          primary={method.path}
          secondary='Method'
          icon={createClear(method.path)}
          key={method.path}
        />
      })

    const rows = methodRows.concat(stateRows).sort(function (rowA, rowB) {
      return rowA.props.primary - rowB.props.primary
    })

    return (
      <div>
        <List>
          {rows}
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    states: state.states,
    methods: state.methods,
    favorites: state.favorites
  }
}

export default connect(mapStateToProps, actions)(Favorites)
