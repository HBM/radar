import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Icon } from 'hbm-react-components'
import SearchBar from './SearchBar'
import classNames from 'classNames'
import StateAndMethodList from './StateAndMethodList'

class Fetch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fetchExpression: {
        containsAllOf: this.props.search || []
      }
    }
    if (this.state.fetchExpression.containsAllOf.length > 0) {
      this.props.changeFetcher(this.state.fetchExpression)
    }
  }

  onChange = (values) => {
    this.setState({fetchExpression: {containsAllOf: values}})
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.changeFetcher(this.state.fetchExpression)
    this.props.setSearch(this.state.fetchExpression.containsAllOf)
  }

  render () {
    const createStar = (path) => {
      return <Icon.Star
        onClick={() => toggleFavorite(path)}
        className={classNames('Icon Fetch Star', {'Star--active': (favorites.indexOf(path) > -1)})}
      />
    }

    const {states, methods, toggleFavorite, favorites} = this.props

    return (
      <div>
        <SearchBar
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          initialValues={this.state.fetchExpression.containsAllOf}
        />
        <StateAndMethodList states={states} methods={methods} iconCreator={createStar} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetchExpression: state.fetcher.expression,
    states: state.states,
    methods: state.methods,
    favorites: state.favorites,
    search: state.search
  }
}

export default connect(mapStateToProps, actions)(Fetch)
