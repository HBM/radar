import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import App from './App'
import Fetch from './Fetch'
import State from './State'
import Favorites from './Favorites'
import Connection from './Connection'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/search' />
        <Route path='search' component={Fetch}>
          <Route path=':path' component={State} />
        </Route>
        <Route path='favorites' component={Favorites} />
        <Route path='connection' component={Connection} />
      </Route>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
