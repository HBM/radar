import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Card, Text, Title, Actions, Content, Textfield, Button } from 'hbm-react-components'

const ConnectionForm = ({url, user, password, onSubmit, isConnected}) => {
  let inputs = {
    url: url,
    user: user,
    password: password
  }
  const submitForm = (event) => {
    event.preventDefault()
    if (inputs.url) {
      onSubmit(inputs)
    }
  }
  const assignInput = (name) => {
    return (event) => {
      event.preventDefault()
      inputs[name] = event.target.value
    }
  }
  const status = isConnected ? 'Connected' : 'Disconnected'
  return (
    <Card>
      <Title>
        Jet Daemon Configuration
      </Title>
      <Content>
        <Text>
          {status}
        </Text>
        <Textfield
          onChange={assignInput('url')}
          type='text'
          defaultValue={url}
          label='Websocket URL'
          placeholder='ws://jetbus.io:8080'
          required
          autoFocus />
        <Textfield
          onChange={assignInput('user')}
          type='text'
          defaultValue={user}
          label='User (optional)'
          placeholder='anonymous' />
        <Textfield
          onChange={assignInput('password')}
          type='password'
          defaultValue={password}
          label='Password (optional)'
          disabled={!inputs.user} />
      </Content>
      <Actions>
        <Button type='submit' onClick={submitForm}>
          Login
        </Button>
      </Actions>
    </Card>
  )
}

ConnectionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

class Connection extends Component {
  render () {
    return <ConnectionForm {...this.props} onSubmit={this.props.connect} />
  }
}

Connection.propTypes = {
  connect: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const con = state.connection
  return {
    isConnected: con.isConnected,
    url: con.url,
    user: con.user,
    password: con.password
  }
}

export default connect(mapStateToProps, actions)(Connection)
