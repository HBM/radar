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

store.subscribe(() => {
  const con = store.getState().settings.connection
  if (con.isConnected && !wasConnected) {
    wasConnected = true
    fetch(con, radarGroupsExpression, 'groups')(store.dispatch)
  } else if (!con.isConnected && wasConnected) {
    wasConnected = false
  }
})

const settings = store.getState().settings
if (settings && settings.connection && settings.connection.url) {
  connect(settings.connection)(store.dispatch)
  // fetch(settings.connection, radarGroupsExpression, 'groups')(store.dispatch)
}

render(
  <Root store={store} />,
  document.getElementById('app')
)
