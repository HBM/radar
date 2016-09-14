import { combineReducers } from 'redux'
import { sorted, array, single } from 'redux-jet'
import uuid from 'uuid'

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

const connections = (state = [{}], action) => {
  switch (action.type) {
    case 'CONNECTION_ADD':
      return [...state, {}]
    case 'CONNECTION_CHANGE':
      return [...state.slice(0, action.index), action.connection, ...state.slice(action.index + 1)]
    case 'CONNECTION_REMOVE':
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
    case 'CONNECTION_SELECT':
      return state.map((con, index) => {
        return {
          ...con,
          isSelected: index === action.index
        }
      })
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

const message = (state = null, action) => {
  switch (action.type) {
    case 'JET_CONNECT_SUCCESS':
      return {text: `Connected to ${action.url}`}
    case 'JET_CONNECT_FAILURE':
      return {text: `Failed to connect to ${action.url}`}
    case 'JET_SET_SUCCESS':
      return {text: `State ${action.path} set successfully`}
    case 'JET_SET_FAILURE':
      return {text: `State ${action.path} set failed (${action.error.message})`}
    case 'JET_CALL_SUCCESS':
      return {text: `Method ${action.path} called successfully`}
    case 'JET_CALL_FAILURE':
      return {text: `Method ${action.path} call failed (${action.error.message})`}
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

const messages = (state = [], action) => {
  const maxLength = 300
  switch (action.type) {
    case 'JET_DEBUG':
      return [{...action, id: uuid.v1()}, ...state.slice(0, maxLength - 1)]
    default:
      return state
  }
}

const data = combineReducers({
  favorites: sorted('favorites'),
  search: sorted('search'),
  groups: single('groups'),
  group: array('group'),
  messages
})

const version = (state = '1.0.0') => {
  return state
}

const settings = combineReducers({search, favorites, connection, connections, version})

const radar = combineReducers({settings, data, message})

export default radar
