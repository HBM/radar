import React from 'react'
import { render } from 'react-dom'
import Root from './components/Root'
import configureStore from './configureStore'
import { connect, fetch } from 'redux-jet'

const store = configureStore()

let wasConnected = false

store.subscribe(() => {
  const con = store.getState().settings.connection
  if (con.isConnected && !wasConnected) {
    wasConnected = true
    fetch(con, {path: {equals: '_radarGroups'}}, 'groups')(store.dispatch)
  } else if (!con.isConnected && wasConnected) {
    wasConnected = false
  }
})

const settings = store.getState().settings
if (settings && settings.connection && settings.connection.url) {
  connect(settings.connection)(store.dispatch)
  fetch(settings.connection, {path: {equals: '_radarGroups'}}, 'groups')(store.dispatch)
}

render(
  <Root store={store} />,
  document.getElementById('app')
)
