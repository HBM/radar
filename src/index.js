import React from 'react'
import 'react-fastclick'
import { render } from 'react-dom'
import Root from './components/Root'
import configureStore from './configureStore'
import { connect, fetch } from 'redux-jet'

const store = configureStore()

let wasConnected = false
const radarGroupsExpression = {
  path: {
    equals: '_radarGroups'
  }
}

let reconnectInterval

store.subscribe(() => {
  const con = store.getState().settings.connection
  if (con.isConnected && !wasConnected) {
    clearInterval(reconnectInterval)
    wasConnected = true
    fetch(con, radarGroupsExpression, 'groups')(store.dispatch)
  } else if (!con.isConnected && wasConnected) {
    if (con.url) {
      reconnectInterval = setInterval(() => {
        console.log('Attempt reconnect to', con)
        connect(con, true)(store.dispatch)
      }, 2000)
    }
    wasConnected = false
  }
})

const settings = store.getState().settings
if (settings && settings.connection && settings.connection.url) {
  connect(settings.connection, true)(store.dispatch)
}

render(
  <Root store={store} />,
  document.getElementById('app')
)
