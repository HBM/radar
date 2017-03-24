import React from 'react'
import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Textarea, Icon } from 'md-components'

export class Method extends React.Component {

  state = {
    args: '[]'
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.call(this.props.connection, this.props.method.path, JSON.parse(this.state.args))
  }

  onChange = (event) => {
    this.setState({
      args: event.target.value
    })
  }

  isValid = () => {
    try {
      const args = JSON.parse(this.state.args)
      return Array.isArray(args)
    } catch (_) {
      return false
    }
  }

  render () {
    return (
      <div className='State'>
        <div className='State-hero'>
          <Icon.Button>
            <Link to={this.props.backUrl} />
            <Icon.ChevronLeft width={30} height={30} className='Split-right-back' />
          </Icon.Button>
          <h1>{this.props.method.path}</h1>
        </div>
        <form onSubmit={this.onSubmit} >
          <Textarea
            value={this.state.args}
            label='Arguments'
            onChange={this.onChange}
            error={!this.isValid() && 'Not a JSON Array'}
          />
          <hr />
          <Button type='submit' raised disabled={!this.isValid()}>Call</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    favorites: state.settings.favorites,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, actions)(Method)
