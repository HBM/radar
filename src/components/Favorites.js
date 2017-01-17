import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { getFilteredStatesAndMethods } from '../reducers'
import * as jetActions from 'redux-jet'
import { Link, Match } from 'react-router'
import { Icon } from 'md-components'
import StateAndMethodList from './StateAndMethodList'
import { Split, SplitRight, SplitLeft } from './Split'
import SearchBar from './SearchBar'
import Details from './Details'
import deepEqual from 'deep-equal'

class Favorites extends React.Component {

  state = {
    searchTerms: [],
    searchTermsChips: []
  }

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
    const favNext = nextProps.favorites.sort()
    const favPrev = this.props.favorites.sort()
    const isOnlineAgain = !this.props.connection.isConnected && nextProps.connection.isConnected
    if (!deepEqual(favNext, favPrev) || isOnlineAgain) {
      this.updateFetch(nextProps)
    }
  }

  onChange = (terms) => {
    this.setState({searchTermsChips: terms})
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.setSelectedFields([])
    this.setState({searchTerms: this.state.searchTermsChips})
  }

  renderContent () {
    const {statesAndMethods, removeFavorite, connection, favorites, selectedFields} = this.props

    const filteredStatesAndMethods = getFilteredStatesAndMethods(statesAndMethods, this.state.searchTerms)

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
      return <StateAndMethodList statesAndMethods={filteredStatesAndMethods} iconCreator={createClear} rootPath='/favorites' selectedFields={selectedFields} />
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
    const {statesAndMethods, selectedFields} = this.props
    const filteredStatesAndMethods = getFilteredStatesAndMethods(statesAndMethods, this.state.searchTerms)

    return (
      <Split className='Favorites'>
        <SplitLeft>
          <SearchBar
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            terms={this.state.searchTermsChips}
            statesAndMethods={filteredStatesAndMethods}
            selectedFields={selectedFields}
          />
          {this.renderContent()}
        </SplitLeft>
        <Match pattern='/favorites/:path' children={({matched, params}, match) => {
          if (matched) {
            return (
              <SplitRight>
                <Details statesAndMethods={statesAndMethods} params={params} backUrl='/favorites' />
              </SplitRight>
            )
          }
          return <SplitRight />
        }
        } />
      </Split>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    statesAndMethods: state.data.favorites,
    favorites: state.settings.favorites,
    connection: state.settings.connection,
    selectedFields: state.settings.selectedFields
  }
}

export default connect(mapStateToProps, {...actions, ...jetActions})(Favorites)
