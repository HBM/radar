import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { Icon } from 'md-components'
import SearchBar from './SearchBar'
import classNames from 'classnames'
import StateAndMethodList from './StateAndMethodList'
import { Link, Match } from 'react-router'
import { Split, SplitRight, SplitLeft } from './Split'
import Details from './Details'

class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      containsAllOf: this.props.search || [],
      selectedFields: []
    }
  }

  getFetchExpression () {
    return {
      path: {
        caseInsensitive: true,
        containsAllOf: this.state.containsAllOf
      },
      sort: {
        byPath: true,
        from: 1,
        to: 50
      }
    }
  }

  fetch () {
    if (this.state.containsAllOf.length > 0) {
      this.props.fetch(this.props.connection, this.getFetchExpression(), 'search')
    }
  }

  componentWillReceiveProps (props) {
    if (!this.props.connection.isConnected && props.connection.isConnected) {
      this.fetch()
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentWillUnmount () {
    this.props.unfetch(this.props.connection, 'search')
  }

  onChange = (terms) => {
    this.setState({containsAllOf: terms})
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.setSelectedFields([])
    this.props.fetch(this.props.connection, this.getFetchExpression(), 'search')
    this.props.setSearch(this.state.containsAllOf)
  }

  renderContent () {
    const {statesAndMethods, toggleFavorite, favorites, connection, selectedFields} = this.props
    if (!connection.isConnected) {
      return (
        <div className='Info'>
          <h3>Not connected</h3>
          <span>Please setup a <Link to='connections'>connection</Link> first.</span>
        </div>
      )
    }
    if (statesAndMethods.length > 0) {
      const createStar = (path) => {
        return <Icon.Star
          onClick={() => toggleFavorite(path)}
          className={classNames('Icon Fetch Star', {'Star--active': (favorites.indexOf(path) > -1)})}
        />
      }
      return <StateAndMethodList
        statesAndMethods={statesAndMethods}
        selectedFields={selectedFields}
        iconCreator={createStar}
        rootPath='/search'
        />
    } else if (this.state.containsAllOf.length > 0) {
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

  render () {
    const {statesAndMethods, selectedFields} = this.props

    return (
      <Split className='Search'>
        <SplitLeft>
          <SearchBar
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            terms={this.state.containsAllOf}
            statesAndMethods={statesAndMethods}
            selectedFields={selectedFields}
          />
          {this.renderContent()}
        </SplitLeft>
        <Match pattern='/search/:path' children={({matched, params}, match) => {
          if (matched) {
            return (
              <SplitRight>
                <Details statesAndMethods={statesAndMethods} params={params} backUrl='/search' />
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
    statesAndMethods: state.data.search,
    favorites: state.settings.favorites,
    search: state.settings.search,
    connection: state.settings.connection,
    selectedFields: state.settings.selectedFields
  }
}

export default connect(mapStateToProps, {...actions, ...jetActions})(Search)
