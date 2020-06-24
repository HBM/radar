import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { connect as connectJet, close as closeJet } from 'redux-jet'
import * as actions from '../actions'
import { Icon, List, Row } from 'md-components'
import { Split, SplitRight, SplitLeft } from './Split'
import Connection, { isValidWebSocketUrl } from './Connection'

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
  selectConnection,
  history
}) => {
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
    return (
      <Row
        avatar={avatar}
        primary={con.name || con.url || 'New Connection'}
        secondary={subtitle}
        icon={icon}
        onClick={() => {
          history.push('/connections/' + index)
        }} // iOS Safari does not get focus event if no click handler is installed
        onFocus={() => {}}
        key={index}
      />
    )
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
      {
        <Route
          path='/connections/:index' children={({ match }) => {
            if (match) {
              return (
                <SplitRight>
                  <Connection />
                </SplitRight>
              )
            }
            return <SplitRight />
          }}
        />
      }
    </Split>
  )
}

const mapStateToProps = (state) => {
  return {
    connections: state.settings.connections,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, { ...actions, connectJet, closeJet })(Connections)
