import React from 'react'
import * as actions from '../actions'
import { connect } from 'react-redux'
import { Button, Textfield } from 'hbm-react-components'

export class Method extends React.Component {

  state = {
    args: '[]'
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.callMethod(this.props.method.path, JSON.parse(this.state.args))
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
          <h1>{this.props.method.path}</h1>
        </div>
        <form onSubmit={this.onSubmit} >
          <Textfield
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
    favorites: state.favorites
  }
}

export default connect(mapStateToProps, actions)(Method)
