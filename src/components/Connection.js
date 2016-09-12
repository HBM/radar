import React from 'react'
import { connect } from 'react-redux'
import { connect as connectJet } from 'redux-jet'
import * as actions from '../actions'
import url from 'url'
import { Textfield, Button, Icon } from 'hbm-react-components'
import { withRouter } from 'react-router'

const isValidWebSocketUrl = (urlString) => {
  try {
    const protocol = url.parse(urlString).protocol
    return protocol === 'ws:' || protocol === 'wss:'
  } catch (_) {
    return false
  }
}

const Connection = ({params: {index}, connect, connections, connectJet, changeConnection, router}) => {
  let connection = connections[index]

  const onChange = (key, value) => {
    if (value === '') {
      delete connection[key]
    } else {
      connection[key] = value
    }
    changeConnection(index, connection)
  }

  const error = () => {
    if (!connection.url || connection.url === '') {
      return 'Required field'
    }
    if (!isValidWebSocketUrl(connection.url)) {
      return 'Invalid WebSocket URL'
    }
    return false
  }
  const onChangeInput = (e) => {
    onChange(e.target.name, e.target.value)
  }
  return (
    <div className='State'>
      <div className='State-hero'>
        <Icon.ChevronLeft width={30} height={30} className='Split-right-back' onClick={() => router.goBack()} />
        <h1>
          <input
            type='text'
            value={connection.name || ''}
            placeholder='Name'
            name='name'
            onChange={onChangeInput}
           />
        </h1>
      </div>
      <form>
        <Textfield
          autoCapitalize='off'
          autoComplete='off'
          autoCorrect='off'
          spellCheck='off'
          onChange={onChangeInput}
          name='url'
          type='text'
          value={connection.url || ''}
          label='WebSocket URL'
          placeholder='ws://jetbus.io:8080'
          error={error()}
          float={false}
          required
          />
        <Textfield
          onChange={onChangeInput}
          name='user'
          type='text'
          value={connection.user || ''}
          label='User (optional)'
          float={false}
          placeholder='admin' />
        <Textfield
          onChange={onChangeInput}
          name='password'
          type='password'
          value={connection.password || ''}
          label='Password (optional)'
          float={false}
          disabled={!connection.user} />
        <hr />
        <Button onClick={() => { connectJet(connection) }} raised disabled={error() && true}>
          Connect
        </Button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    connections: state.settings.connections
  }
}

export default withRouter(connect(mapStateToProps, {...actions, connectJet})(Connection))
