import React from 'react'
import { connect } from 'react-redux'
import { connect as connectJet } from 'redux-jet'
import * as actions from '../actions'
import { Textfield, Button, Icon, List, Row } from 'hbm-react-components'
import url from 'url'

const isValidWebSocketUrl = (urlString) => {
  try {
    const protocol = url.parse(urlString).protocol
    return protocol === 'ws:' || protocol === 'wss:'
  } catch (_) {
    return false
  }
}

const ConnectionDetails = ({connection, onChange, connect}) => {
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
        <h1>{connection.name && connection.name || <em>Unnamed</em>}</h1>
      </div>
      <form>
        <Textfield
          onChange={onChangeInput}
          name='name'
          type='text'
          value={connection.name || ''}
          label='Name'
          placeholder='Some name'
          />
        <Textfield
          onChange={onChangeInput}
          name='url'
          type='text'
          value={connection.url || ''}
          label='WebSocket URL'
          placeholder='ws://jetbus.io:8080'
          error={error()}
          required
          />
        <Textfield
          onChange={onChangeInput}
          name='user'
          type='text'
          value={connection.user || ''}
          label='User (optional)'
          placeholder='admin' />
        <Textfield
          onChange={onChangeInput}
          name='password'
          type='password'
          value={connection.password || ''}
          label='Password (optional)'
          disabled={!connection.user} />
        <hr />
        <Button onClick={connect} raised disabled={error() && true}>
          Connect
        </Button>
      </form>
    </div>
  )
}

const Connections = ({
  connection,
  connections,
  connectJet,
  addConnection,
  removeConnection,
  changeConnection,
  selectConnection}) => {
  const toConnectionRow = (con, index) => {
    const remove = () => {
      removeConnection(index)
    }
    const onSelect = () => {
      selectConnection(index)
    }
    const isConnected = connection &&
      connection.url === con.url &&
      connection.user === con.user &&
      connection.isConnected
    const avatar = isConnected ? <Icon.Check /> : <Icon.Close />
    const icon = <Icon.RemoveCircle onClick={remove} />
    const subtitle = isConnected ? 'Connected' : 'Disconnected'
    return <Row avatar={avatar}
      primary={con.name || con.url || 'New Connection'}
      secondary={subtitle}
      icon={icon}
      onFocus={onSelect}
      key={index} />
  }

  const renderSelected = () => {
    const index = connections.findIndex(con => con.isSelected)
    if (index === -1) {
      return
    }
    let con = connections[index]
    const onChange = (key, value) => {
      if (value === '') {
        delete con[key]
      } else {
        con[key] = value
      }
      changeConnection(index, con)
    }
    const connect = () => {
      connectJet(con)
    }
    return <ConnectionDetails onChange={onChange} connection={con} connect={connect} />
  }

  return (
    <div className='Split Connections'>
      <div className='Split-left'>
        <List>
          {connections.map(toConnectionRow)}
          <Row primary='' avatar={<span />} icon={<Icon.AddCircle className='Connections-add' onClick={addConnection} />} />
        </List>
      </div>
      <div className='Split-right'>
        {renderSelected()}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    connections: state.settings.connections,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, {...actions, connectJet})(Connections)
