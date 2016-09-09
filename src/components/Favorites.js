import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { withRouter } from 'react-router'
import { Icon } from 'hbm-react-components'
import StateAndMethodList from './StateAndMethodList'

class Favorites extends React.Component {
  updateFetch (props) {
    this.props.fetch(props.connection, {
      path: {
        equalsOneOf: props.favorites
      },
      sort: {
        byPath: true,
        from: 1,
        to: 1000
      }
    }, 'favorites')
  }

  componentWillMount () {
    this.updateFetch(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const favNext = JSON.stringify(nextProps.favorites.sort())
    const favPrev = JSON.stringify(this.props.favorites.sort())
    if (favNext !== favPrev) {
      this.updateFetch(nextProps)
    }
  }

  onSelect = (stateOrMethod) => {
    this.props.router.push('/favorites/' + encodeURIComponent(stateOrMethod.path))
  }

  render () {
    const {children, statesAndMethods, removeFavorite} = this.props

    const createClear = (path) => {
      return <Icon.RemoveCircle
        onClick={() => removeFavorite(path)}
        className='Icon Icon-Remove'
        />
    }

    return (
      <div className='Split Favorites'>
        <div className='Split-left'>
          <StateAndMethodList statesAndMethods={statesAndMethods} iconCreator={createClear} onSelect={this.onSelect} />
        </div>
        <div className='Split-right'>
          {children && React.cloneElement(children, {statesAndMethods})}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    statesAndMethods: state.data.favorites,
    favorites: state.settings.favorites,
    connection: state.settings.connection
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Favorites))
