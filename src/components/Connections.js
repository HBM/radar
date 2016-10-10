import React from 'react'
import { connect } from 'react-redux'
import { Match } from 'react-router'
import { connect as connectJet, close as closeJet } from 'redux-jet'
import * as actions from '../actions'
import { Icon, List, Row } from 'md-components'
import url from 'url'
import { Split, SplitRight, SplitLeft } from './Split'
import Connection from './Connection'

const isValidWebSocketUrl = (urlString) => {
  try {
    const protocol = url.parse(urlString).protocol
    return protocol === 'ws:' || protocol === 'wss:'
  } catch (_) {
    return false
  }
}

const Connections = ({
  connection,
  connections,
  connectJet,
  children,
  closeJet,
  router,
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
    let avatar
    let subtitle
    if (isValidWebSocketUrl(con.url)) {
      const isConnected = isCurrentConnection(con)
      avatar = isConnected ? <Icon.CloudDone className='Icon' /> : <Icon.CloudOff className='Icon' />

      subtitle = isConnected ? 'Connected' : 'Disconnected'
    } else {
      avatar = <Icon.Report className='Icon' />
      subtitle = 'Not configured'
    }
    const icon = <Icon.RemoveCircle onClick={remove} className='Icon Icon-Remove' />
    return <Row avatar={avatar}
      linkTo={'/connections/' + index}
      primary={con.name || con.url || 'New Connection'}
      secondary={subtitle}
      icon={icon}
      onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
      key={index} />
  }

  return (
    <Split className='Connections'>
      <SplitLeft>
        <List>
          <Row primary='Connections' />
          {connections.map(toConnectionRow)}
          <Row primary='' avatar={<span />} icon={<Icon.AddCircle className='Icon Connections-add Icon-Add' onClick={addConnection} />} />
        </List>
      </SplitLeft>
      <SplitRight>
        <Match pattern='/connections/:index' component={Connection} />
      </SplitRight>
    </Split>
  )
}

const mapStateToProps = (state) => {
  return {
    connections: state.settings.connections,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, {...actions, connectJet, closeJet})(Connections)
