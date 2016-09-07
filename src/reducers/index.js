import { combineReducers } from 'redux'
import { sorted, array, single } from 'redux-jet'

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

const connection = (state = {isConnected: false}, action) => {
  switch (action.type) {
    case 'JET_CONNECT_REQUEST':
      return {
        isConnected: false,
        url: action.url,
        user: action.user,
        password: action.password
      }
    case 'JET_CONNECT_SUCCESS':
      return {
        ...state,
        isConnected: true,
        url: action.url,
        user: action.user,
        password: action.password
      }
    case 'JET_CONNECT_FAILURE':
      return {
        isConnected: false,
        url: action.url,
        error: action.message
      }
    default:
      return state
  }
}

const data = combineReducers({
  favorites: sorted('favorites'),
  search: sorted('search'),
  groups: single('groups'),
  group: array('group')
})

const settings = combineReducers({search, favorites, connection})

const radar = combineReducers({settings, data})

export default radar
