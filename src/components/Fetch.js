import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as jetActions from '../redux-jet/actions'
import { Icon } from 'hbm-react-components'
import SearchBar from './SearchBar'
import classNames from 'classnames'
import StateAndMethodList from './StateAndMethodList'
import { withRouter } from 'react-router'

class Fetch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fetchExpression: {
        containsAllOf: this.props.search || []
      }
    }
  }

  componentDidMount () {
    if (this.state.fetchExpression.containsAllOf.length > 0) {
      this.props.fetch(this.props.connection, this.state.fetchExpression, 'search')
    }
  }

  componentWillUnmount () {
    this.props.unfetch(this.props.connection, 'search')
  }

  onChange = (values) => {
    this.setState({fetchExpression: {containsAllOf: values}})
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.fetch(this.props.connection, this.state.fetchExpression, 'search')
    this.props.setSearch(this.state.fetchExpression.containsAllOf)
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
      <div className='Split'>
        <div className='Split-left'>
          <SearchBar
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            initialValues={this.state.fetchExpression.containsAllOf}
          />
          <StateAndMethodList statesAndMethods={statesAndMethods} iconCreator={createStar} onSelect={this.onSelect} />
        </div>
        <div className='Split-right'>
          {children && React.cloneElement(children, {statesAndMethods})}
        </div>
      </div>
    )
  }
}

Fetch.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

const mapStateToProps = (state) => {
  return {
    fetchExpression: state.settings.fetcher.expression,
    statesAndMethods: state.data.search,
    favorites: state.settings.favorites,
    search: state.settings.search,
    connection: state.settings.connection
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Fetch))
