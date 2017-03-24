import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { connect as connectJet, close as closeJet } from 'redux-jet'
import * as actions from '../actions'
import url from 'url'
import { Textfield, Button, Icon } from 'md-components'

const isValidWebSocketUrl = (urlString) => {
  try {
    const protocol = url.parse(urlString).protocol
    return protocol === 'ws:' || protocol === 'wss:'
  } catch (_) {
    return false
  }
}

const Connection = ({
  match: {params: {index}},
  connect,
  connections,
  connectJet,
  closeJet,
  current,
  changeConnection,
  history}) => {
  let connection = connections[index]

  const isConnected = connection.url === current.url && connection.user === current.user && current.isConnected

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

  const getLink = () => {
    return `${window.location.origin}?connection=${encodeURIComponent(JSON.stringify(connection))}`
  }

  const onChangeInput = (e) => {
    onChange(e.target.name, e.target.value)
  }

  const goBack = () => {
    history.goBack()
  }

  return (
    <div className='State'>
      <div className='State-hero'>
        <Icon.Button onClick={() => goBack()} >
          <Icon.ChevronLeft width={30} height={30} className='Split-right-back' />
        </Icon.Button>
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
      <form onSubmit={(e) => { e.preventDefault() }}>
        <Textfield
          autoCapitalize='off'
          autoComplete='off'
          autoCorrect='off'
          spellCheck={false}
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
        <Textfield
          disabled
          type='text'
          label='Bookmark Link'
          defaultValue={getLink()}
          />
        <hr />
        {!isConnected
          ? <Button type='submit' onClick={() => { closeJet(current); connectJet(connection, true) }} raised disabled={error() && true}>
              Connect
          </Button>
          : <Button type='submit' onClick={() => { closeJet(connection) }} raised disabled={error() && true}>
              Disconnect
          </Button>
        }
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  connections: state.settings.connections,
  current: state.settings.connection
})

export default withRouter(connect(mapStateToProps, {...actions, connectJet, closeJet})(Connection))
