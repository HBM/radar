import React from 'react'
import { render } from 'react-dom'
import Root from './components/Root'
import configureStore from './configureStore'
import { connect } from './actions'

const store = configureStore()
const connection = store.getState().connection
if (connection && connection.url) {
  connect(connection)(store.dispatch)
}
render(
  <Root store={store} />,
  document.getElementById('app')
)
