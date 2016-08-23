import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Icon } from 'hbm-react-components'
import StateAndMethodList from './StateAndMethodList'

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

    const isFavorite = function (stateOrMethod) {
      return favorites.indexOf(stateOrMethod.path) > -1
    }

    return (
      <div>
        <StateAndMethodList states={states.filter(isFavorite)} methods={methods.filter(isFavorite)} iconCreator={createClear} />
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
