import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { getFilteredStatesAndMethods } from '../reducers'
import * as jetActions from 'redux-jet'
import { Link, Route } from 'react-router-dom'
import { Icon } from 'md-components'
import StateAndMethodList from '../containers/StateAndMethodList'
import { Split, SplitRight, SplitLeft } from './Split'
import SearchBar from './SearchBar'
import Details from './Details'
import deepEqual from 'deep-equal'

const Favorites = (props) => {
  const [searchTerms, setSearchTerms] = useState([])
  const [searchTermsChips, setSearchTermsChips] = useState([])
  const prevFavorites = useRef(props.favorites)
  const prevIsConnected = useRef(props.connection.isConnected)

  useEffect(() => {
    const updateFetch = () => {
      props.fetch(props.connection, {
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

    const favNext = props.favorites.sort()
    const favPrev = prevFavorites.current.sort()
    const isOnlineAgain = !prevIsConnected.current && props.connection.isConnected
    if (!deepEqual(favNext, favPrev) || isOnlineAgain) {
      prevFavorites.current = props.favorites
      prevIsConnected.current = props.connection.isConnected
      updateFetch()
    }
  }, [props.favorites, props.connection.isConnected])

  const onChange = (terms) => {
    setSearchTermsChips(terms)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    props.setSelectedFields([])
    setSearchTerms(setSearchTermsChips)
  }

  const renderContent = () => {
    const filteredStatesAndMethods = getFilteredStatesAndMethods(props.statesAndMethods, searchTerms || [])

    if (!props.connection.isConnected) {
      return (
        <div className='Info'>
          <h3>Not connected</h3>
          <span>Please setup a <Link to='connections'>connection</Link> first.</span>
        </div>
      )
    }
    if (props.statesAndMethods.length > 0) {
      const createClear = (path) => {
        return (
          <Icon.RemoveCircle
            onClick={() => props.removeFavorite(path)}
            className='Icon Icon-Remove'
          />
        )
      }
      return <StateAndMethodList statesAndMethods={filteredStatesAndMethods} iconCreator={createClear} rootPath='/favorites' selectedFields={props.selectedFields} />
    } else if (props.favorites.length === 0) {
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
            {props.favorites.sort().map(fav => <li key={fav}>{fav}</li>)}
          </ul>
        </div>
      )
    }
  }

  const filteredStatesAndMethods = getFilteredStatesAndMethods(props.statesAndMethods, searchTerms || [])

  return (
    <Split className='Favorites'>
      <SplitLeft>
        <SearchBar
          onChange={onChange}
          onSubmit={onSubmit}
          terms={searchTermsChips}
          statesAndMethods={filteredStatesAndMethods}
          selectedFields={props.selectedFields}
        />
        {renderContent()}
      </SplitLeft>
      <Route
        path='/favorites/:path' children={({ match }) => {
          if (match) {
            return (
              <SplitRight>
                <Details statesAndMethods={props.statesAndMethods} params={match.params} backUrl='/favorites' />
              </SplitRight>
            )
          }
          return <SplitRight />
        }}
      />
    </Split>
  )
}

const mapStateToProps = (state) => {
  return {
    statesAndMethods: state.data.favorites,
    favorites: state.settings.favorites,
    connection: state.settings.connection,
    selectedFields: state.settings.selectedFields
  }
}

export default connect(mapStateToProps, { ...actions, ...jetActions })(Favorites)
