import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { withRouter, Link } from 'react-router'
import { Icon } from 'hbm-react-components'
import StateAndMethodList from './StateAndMethodList'
import { Split, SplitRight, SplitLeft } from './Split'

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

  renderContent () {
    const {statesAndMethods, removeFavorite, connection, favorites} = this.props
    if (!connection.isConnected) {
      return (
        <div className='Info'>
          <h3>Not connected</h3>
          <span>Please setup a <Link to='connections'>connection</Link> first.</span>
        </div>
      )
    }
    if (statesAndMethods.length > 0) {
      const createClear = (path) => {
        return <Icon.RemoveCircle
          onClick={() => removeFavorite(path)}
          className='Icon Icon-Remove'
          />
      }
      return <StateAndMethodList statesAndMethods={statesAndMethods} iconCreator={createClear} onSelect={this.onSelect} />
    } else if (favorites.length === 0) {
      return (
        <div className='Info'>
          <h3>Your favorites list is empty</h3>
          <span>You can add favorites from the <Link to='/search'>search</Link> view.</span>
        </div>
      )
    } else {
      return (
        <div className='Info'>
          <h3>None of your favorites is available</h3>
          <span>There are your favorites:</span>
          <ul>
            {favorites.sort().map(fav => <li>{fav}</li>)}
          </ul>
        </div>
      )
    }
  }

  render () {
    const {children, statesAndMethods} = this.props

    return (
      <Split className='Favorites'>
        <SplitLeft>
          {this.renderContent()}
        </SplitLeft>
        <SplitRight>
          {children && React.cloneElement(children, {statesAndMethods})}
        </SplitRight>
      </Split>
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
