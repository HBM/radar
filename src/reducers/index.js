import { combineReducers } from 'redux'
import states from './states'
import methods from './methods'
import connection, * as fromConnection from './connection'
import fetcher, * as fromFetcher from './fetcher'

const gui = (state = {}, action) => {
  switch (action.type) {
    case 'CONNECT_SUCCESS':
      return {
        showConnection: false
      }
    case 'SHOW_CONNECTION':
      return {
        showConnection: true
      }
    default:
      return state
  }
}

const favorites = (state = [], action) => {
  const addFavorite = () => [...state, action.path]
  const removeFavorite = () => {
    const index = state.indexOf(action.path)
    return [...state.slice(0, index), ...state.slice(index + 1, state.length)]
  }
  switch (action.type) {
    case 'FAVORITE_ADD':
      return addFavorite()
    case 'FAVORITE_REMOVE':
      return removeFavorite()
    case 'FAVORITE_TOGGLE':
      const index = state.indexOf(action.path)
      if (index > -1) {
        return removeFavorite()
      } else {
        return addFavorite()
      }
    default:
      return state
  }
}

const search = (state = [], action) => {
  switch (action.type) {
    case 'SEARCH_SET':
      return action.search
    default:
      return state
  }
}

const radar = combineReducers({states, methods, fetcher, connection, gui, favorites, search})

export default radar

export const getIsConnecting = (url) => fromConnection.getIsConnecting(url)
export const getIsChangingFetcher = () => fromFetcher.getIsChanging()
export const getIsSettingState = (path) => states.getIsSetting(path)
