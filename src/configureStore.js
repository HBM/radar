import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import radar from './reducers'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash.throttle'

const configureStore = () => {
  const middlewares = [thunk]
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger())
  }

  const prevState = loadState()
  let isCompatible
  if (prevState && prevState.settings && prevState.settings.version === '1.0.0') {
    console.log('compat')
    isCompatible = true
  }

  const store = createStore(
    radar,
    isCompatible ? prevState : {},
    applyMiddleware(...middlewares)
  )
  store.subscribe(throttle(() => {
    const state = {
      settings: store.getState().settings
    }
    console.log('save', state)
    saveState(state)
  }, 1000))
  return store
}

export default configureStore
