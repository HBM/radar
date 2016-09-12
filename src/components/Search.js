import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from 'redux-jet'
import { Icon } from 'hbm-react-components'
import SearchBar from './SearchBar'
import classNames from 'classnames'
import StateAndMethodList from './StateAndMethodList'
import { withRouter } from 'react-router'
import { Split, SplitRight, SplitLeft } from './Split'

class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      containsAllOf: this.props.search || []
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
        to: 300
      }
    }
  }

  componentDidMount () {
    if (this.state.containsAllOf.length > 0) {
      this.props.fetch(this.props.connection, this.getFetchExpression(), 'search')
    }
  }

  componentWillUnmount () {
    this.props.unfetch(this.props.connection, 'search')
  }

  onChange = (terms) => {
    console.log(terms)
    this.setState({containsAllOf: terms})
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.fetch(this.props.connection, this.getFetchExpression(), 'search')
    this.props.setSearch(this.state.containsAllOf)
  }

  onSelect = (stateOrMethod) => {
    this.props.router.push('/search/' + encodeURIComponent(stateOrMethod.path))
  }

  render () {
    const createStar = (path) => {
      return <Icon.Star
        onClick={() => toggleFavorite(path)}
        className={classNames('Icon Fetch Star', {'Star--active': (favorites.indexOf(path) > -1)})}
      />
    }

    const {statesAndMethods, toggleFavorite, favorites, children} = this.props

    return (
      <Split className='Search'>
        <SplitLeft>
          <SearchBar
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            terms={this.state.containsAllOf}
          />
          <StateAndMethodList statesAndMethods={statesAndMethods} iconCreator={createStar} onSelect={this.onSelect} />
        </SplitLeft>
        <SplitRight>
          {children && React.cloneElement(children, {statesAndMethods, key: 'search/details'})}
        </SplitRight>
      </Split>
    )
  }
}

Search.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

const mapStateToProps = (state) => {
  return {
    statesAndMethods: state.data.search,
    favorites: state.settings.favorites,
    search: state.settings.search,
    connection: state.settings.connection
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Search))