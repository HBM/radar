import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import radar from './reducers'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash.throttle'
import deepEqual from 'deep-equal'

const configureStore = () => {
  const middlewares = [thunk]
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger())
  }

  const prevState = loadState()
  let isCompatible
  if (prevState && prevState.settings && prevState.settings.version === '1.0.0') {
    isCompatible = true
  }

  const store = createStore(
    radar,
    isCompatible ? prevState : {},
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
  let lastSettings = {}
  store.subscribe(throttle(() => {
    const state = {
      settings: store.getState().settings
    }
    if (!deepEqual(lastSettings, state.settings)) {
      saveState(state)
    }
  }, 1000))
  return store
}

export default configureStore
