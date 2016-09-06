import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import App from './App'
import Search from './Search'
import Details from './Details'
import Favorites from './Favorites'
import Connection from './Connection'

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
        <Route path='connection' component={Connection} />
      </Route>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
