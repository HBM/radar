import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { List, Row, Icon } from 'hbm-react-components'
import SearchBar from './SearchBar'
import classNames from 'classNames'

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

    const stateAvatar = <span className='State-avatar'>S</span>
    const stateRows = states.map((state) => {
      return <Row
        avatar={stateAvatar}
        primary={state.path}
        secondary={'State / ' + JSON.stringify(state.value)}
        icon={createStar(state.path)}
        key={state.path}
		/>
    })

    const methodAvatar = <span className='Method-avatar'>M</span>
    const methodRows = methods.map((method) => {
      return <Row
        avatar={methodAvatar}
        primary={method.path}
        secondary='Method'
        icon={createStar(method.path)}
        key={method.path}
      />
    })

    const rows = methodRows.concat(stateRows).sort(function (rowA, rowB) {
      return rowA.props.primary - rowB.props.primary
    })

    return (
      <div>
        <SearchBar
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          initialValues={this.state.fetchExpression.containsAllOf}
        />
        <List>
          {rows}
        </List>
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
