import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { List, Row, Icon, Chip } from 'hbm-react-components'
import classNames from 'classNames'

class Fetch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      focus: false,
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

  onFocus = () => {
    this.setState({focused: true})
  }

  onBlur = () => {
    this.setState({focused: false})
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

    const {fetchExpression, changeFetcher, states, methods, toggleFavorite, favorites} = this.props

	console.log(states, methods)

    const stateAvatar = <span className='State-avatar'>S</span>
    const stateRows = states.map((state) => {
	  console.log('state', state)
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

	const rows = methodRows.concat(stateRows).sort(function(rowA, rowB) {
			return rowA.props.primary - rowB.props.primary
	})

	const spaceCode = 32
	const enterCode = 13

	let chips

    return (
      <div>
        <form 
          className={classNames('Searchbar', {'Searchbar--focused': this.state.focused})} 
          onSubmit={this.onSubmit} 
          onClick={() => chips.input.focus()}
		  >
		  <button type='submit' style={{display: 'none'}} onSubmit={this.onSubmit}/>
          <div className='Searchbar-icon'>
		    <Icon.Search width={36} height={36}/>
          </div>
          <Chip 
            ref={(s) => chips = s} 
		    onChange={this.onChange} 
			initialValues={this.state.fetchExpression.containsAllOf} 
			delimiters={[spaceCode, enterCode]}
			onFocus={this.onFocus}
			onBlur={this.onBlur}
			/>
        </form>
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
