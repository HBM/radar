import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import App from './App'
import Search from './Search'
import Details from './Details'
import Favorites from './Favorites'
import Connections from './Connections'
import Connection from './Connection'
import Group from './Group'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/search' />
        <Route path='search' component={Search}>
          <Route path=':path' component={Details} />
        </Route>
        <Route path='favorites' component={Favorites}>
          <Route path=':path' component={Details} />
        </Route>
        <Route path='connections' component={Connections}>
          <Route path=':index' component={Connection} />
        </Route>
        <Route path='groups/:group' component={Group}>
          <Route path=':path' component={Details} />
        </Route>
      </Route>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
