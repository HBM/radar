// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import React from 'react'
import 'react-fastclick'
import { render } from 'react-dom'
import Root from './components/Root'
import configureStore from './configureStore'
import { connect, fetch, close } from 'redux-jet'
import { setConnectionDead } from './actions'

const store = configureStore()

const radarGroupsExpression = {
  path: {
    equals: '_radarGroups'
  }
}

const heartbeatExpression = {
  path: {
    equals: '_heartbeat'
  }
}

const createAutoReconnect = reconnect => {
  let timer
  return ({ settings: { connection = {} } }) => {
    if ((connection.reconnect || connection.error) && !timer) {
      console.log('activate reconect')
      timer = setTimeout(() => {
        console.log('reonnection')
        timer = false
        reconnect(connection)
      }, 1000)
    }
    if (connection.new) {
      clearTimeout(timer)
      timer = false
    }
  }
}

const autoReconnect = createAutoReconnect(connection => {
  connect(connection, true)(store.dispatch)
})

const createAutoFetchRadarStates = fetch => {
  let wasConnected = false
  return ({ settings: { connection = {} } }) => {
    if (connection.isConnected && !wasConnected) {
      wasConnected = true
      fetch(connection, radarGroupsExpression, 'groups')
      fetch(connection, heartbeatExpression, 'heartbeat')
    } else if (!connection.isConnected && wasConnected) {
      wasConnected = false
    }
  }
}

const autoFetchRadarStates = createAutoFetchRadarStates((connection, expression, id) => {
  fetch(connection, expression, id)(store.dispatch)
})

const isSameConnection = (a, b) => (
  a.user === b.user &&
  a.url === b.url &&
  a.password === b.password
)

const createHeartbeatChecker = (onDead) => {
  let now
  let timer
  let prevConnection = {}
  return ({ settings: { connection = {} }, data: { heartbeat } }) => {
    if (!isSameConnection(prevConnection, connection)) {
      clearTimeout(timer)
      now = false
    }
    prevConnection = connection
    if (!connection.isConnected) {
      clearTimeout(timer)
    }
    if (!heartbeat || !heartbeat.value) {
      return
    }
    if (heartbeat.value.now !== now) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        onDead(connection)
      }, 2 * heartbeat.value.next)
      now = heartbeat.value.now
    }
  }
}

const heartbeatChecker = createHeartbeatChecker(connection => {
  console.log('DEAD', connection, typeof close)
  store.dispatch(setConnectionDead())
  store.dispatch(close(connection, true))
})

store.subscribe(() => {
  const state = store.getState()
  autoReconnect(state)
  autoFetchRadarStates(state)
  heartbeatChecker(state)
})

try {
  const connection = JSON.parse(decodeURIComponent(window.location.hash.match(/connection=([^&]+)/)[1]))
  console.log('reconnect from URL')
  connect(connection, true)(store.dispatch)
} catch (_) {
  const settings = store.getState().settings
  if (settings && settings.connection && settings.connection.url) {
    console.log('reconnect from localStorage')
    settings.connection.lost = false
    connect(settings.connection, true)(store.dispatch)
  }
}

render(
  <Root store={store} />,
  document.getElementById('app')
)
