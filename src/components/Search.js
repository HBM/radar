import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { Icon } from 'md-components'
import SearchBar from './SearchBar'
import classNames from 'classnames'
import StateAndMethodList from '../containers/StateAndMethodList'
import { Link, Route } from 'react-router-dom'
import { Split, SplitRight, SplitLeft } from './Split'
import Details from './Details'

const Search = (props) => {
  const [containsAllOf, setContainsAllOf] = useState([])
  const isConnected = useRef(false)

  useEffect(() => {
    if (!isConnected.current && props.connection.isConnected) {
      fetch()
    }
    isConnected.current = props.connection.isConnected

    return () => {
      isConnected.current = false
      props.unfetch(props.connection, 'search')
    }
  }, [props.connection.isConnected])

  useEffect(() => {
    fetch()
  }, [containsAllOf])

  useEffect(() => {
    setContainsAllOf(props.search)
  }, [props.search])

  const getFetchExpression = () => {
    return {
      path: {
        caseInsensitive: true,
        containsAllOf
      },
      sort: {
        byPath: true,
        from: 1,
        to: 50
      }
    }
  }

  const fetch = () => {
    if (containsAllOf.length > 0) {
      props.fetch(props.connection, getFetchExpression(), 'search')
    }
  }

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className='Info'>
          <h3>Not connected</h3>
          <span>Please setup a <Link to='connections'>connection</Link> first.</span>
        </div>
      )
    }
    if (props.statesAndMethods.length > 0) {
      const createStar = (path) => {
        return (
          <Icon.Star
            onClick={() => props.toggleFavorite(path)}
            className={classNames('Icon Fetch Star', { 'Star--active': (props.favorites.indexOf(path) > -1) })}
          />
        )
      }
      return (
        <StateAndMethodList
          statesAndMethods={props.statesAndMethods}
          selectedFields={props.selectedFields}
          iconCreator={createStar}
          rootPath='/search'
        />)
    } else if (containsAllOf.length > 0) {
      return (
        <div className='Info'>
          <h3>No Matches for search</h3>
          <span>Try a different search term</span>
        </div>
      )
    } else {
      return (
        <div className='Info'>
          <h3>Enter at least one search term</h3>
          <span>State and Method names are matched case insensitive against your search terms</span>
        </div>
      )
    }
  }

  const onChange = (terms) => {
    setContainsAllOf(terms)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    props.setSelectedFields([])
    props.fetch(props.connection, getFetchExpression(), 'search')
    props.setSearch(containsAllOf)
  }

  return (
    <Split className='Search'>
      <SplitLeft>
        <SearchBar
          onChange={onChange}
          onSubmit={onSubmit}
          terms={containsAllOf}
          statesAndMethods={props.statesAndMethods}
          selectedFields={props.selectedFields}
        />
        {renderContent()}
      </SplitLeft>
      <Route
        path='/search/:path' children={({ match }) => {
          if (match && match.params.path) {
            return (
              <SplitRight>
                <Details statesAndMethods={props.statesAndMethods} params={match.params} backUrl='/search' />
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
    statesAndMethods: state.data.search,
    favorites: state.settings.favorites,
    search: state.settings.search,
    connection: state.settings.connection,
    selectedFields: state.settings.selectedFields
  }
}

export default connect(mapStateToProps, { ...actions, ...jetActions })(Search)
