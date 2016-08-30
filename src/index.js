import React from 'react'
import { render } from 'react-dom'
import Root from './components/Root'
import configureStore from './configureStore'
import { connect } from './redux-jet/actions'

const store = configureStore()
const jet = store.getState().jet
if (jet && jet.connection && jet.connection.url) {
  connect(jet.connection)(store.dispatch)
}

render(
  <Root store={store} />,
  document.getElementById('app')
)
