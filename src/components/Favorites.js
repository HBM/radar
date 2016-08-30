import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from '../redux-jet/actions'
import { withRouter } from 'react-router'
import { Icon } from 'hbm-react-components'
import StateAndMethodList from './StateAndMethodList'

class Favorites extends React.Component {
  constructor (props) {
    super(props)
    this.props.changeFetcher({
      equalsOneOf: this.props.favorites
    })
  }

  onSelect = (stateOrMethod) => {
    this.props.router.push('/favorites/' + encodeURIComponent(stateOrMethod.path))
  }

  render () {
    const {children, states, methods, removeFavorite, favorites} = this.props

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
      <div className='Split'>
        <div className='Split-left'>
          <StateAndMethodList states={states.filter(isFavorite)} methods={methods.filter(isFavorite)} iconCreator={createClear} onSelect={this.onSelect} />
        </div>
        <div className='Split-right'>
          {children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    states: state.jet.states,
    methods: state.jet.methods,
    favorites: state.favorites
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Favorites))
