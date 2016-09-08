import React from 'react'
import { connect } from 'react-redux'
import { connect as connectJet, close as closeJet } from 'redux-jet'
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
  closeJet,
  addConnection,
  removeConnection,
  changeConnection,
  selectConnection}) => {
  const isCurrentConnection = (con) => {
    return connection &&
      connection.url === con.url &&
      connection.user === con.user &&
      connection.isConnected
  }

  const toConnectionRow = (con, index) => {
    const remove = () => {
      if (isCurrentConnection(con)) {
        closeJet(con)
      }
      removeConnection(index)
    }
    const onSelect = () => {
      selectConnection(index)
    }
    let avatar
    let subtitle
    if (isValidWebSocketUrl(con.url)) {
      const isConnected = isCurrentConnection(con)
      avatar = isConnected ? <Icon.CloudDone fill='#333' /> : <Icon.CloudOff fill='#333' />

      subtitle = isConnected ? 'Connected' : 'Disconnected'
    } else {
      avatar = <Icon.Report fill='#333' />
      subtitle = 'Not configured'
    }
    const icon = <Icon.RemoveCircle onClick={remove} fill='#333' />
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
          <Row primary='Connections' />
          {connections.map(toConnectionRow)}
          <Row primary='' avatar={<span />} icon={<Icon.AddCircle fill='#333' className='Connections-add' onClick={addConnection} />} />
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

export default connect(mapStateToProps, {...actions, connectJet, closeJet})(Connections)
