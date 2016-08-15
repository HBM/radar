import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import App from './App.js'
import Fetch from './Fetch.js'
import Connection from './Connection.js'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Fetch} />
        <Route path='/connection' component={Connection} />
      </Route>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
