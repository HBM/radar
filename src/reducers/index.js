import { combineReducers } from 'redux'
import { sorted, array, single } from 'redux-jet'

const favorites = (state = [], action) => {
  const addFavorite = () => [...state, action.path]
  const removeFavorite = () => {
    const index = state.indexOf(action.path)
    return [...state.slice(0, index), ...state.slice(index + 1, state.length)]
  }
  switch (action.type) {
    case 'FAVORITE_SET':
      return action.favorites
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
    case 'FAVORITE_FAILURE':
      return {text: `Favorites import failed: ${action.reason}`}
    case 'FAVORITE_SET':
      return {text: `${action.favorites.length} favorites imported successfully`}
    case 'JET_CLOSED':
      return {text: `Disconnected from ${action.url}`}
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
    case 'JET_CLOSED':
    case 'JET_CLOSE':
      return {
        isConnected: false
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

const toMessage = (json) => {
  let message = {
    messageId: json.id,
    json
  }
  if (json.method && json.id !== undefined) {
    message.type = 'Request'
    message.params = json.params
    message.method = json.method
  } else if (json.result !== undefined || json.error !== undefined) {
    message.type = 'Response'
    message.result = json.result
    message.error = json.error
  } else if (json.method) {
    message.type = 'Notification'
    message.params = json.params
    message.method = json.method
  } else {
    message.type = 'Invalid JSON-RPC'
  }
  return message
}

export const toFormatedMessages = (messages) => {
  let formatedMessages = []
  messages.forEach(message => {
    if (!message.json) {
      formatedMessages.push({
        type: 'Invalid JSON',
        payload: message.string,
        direction: message.direction,
        uid: message.uid,
        timestamp: message.timestamp
      })
    } else if (Array.isArray(message.json)) {
      const tmp = message.json.map((json, index) => {
        return {
          ...toMessage(json),
          batchIndex: index,
          uid: message.uid,
          timestamp: message.timestamp,
          direction: message.direction
        }
      })
      formatedMessages = formatedMessages.concat(tmp)
    } else {
      formatedMessages.push({
        ...toMessage(message.json),
        uid: message.uid,
        timestamp: message.timestamp,
        direction: message.direction
      })
    }
  })
  return formatedMessages
}

const messages = (state = [], action) => {
  const maxLength = 100
  switch (action.type) {
    case 'JET_CONNECT_REQUEST':
      return []
    case 'JET_DEBUG':
      const uid = (state[0] && state[0].uid || 0) + 1
      return [{...action, uid: uid}, ...state.slice(0, maxLength - 1)]
    default:
      return state
  }
}

const traffic = (state = {in: 0, out: 0}, action) => {
  switch (action.type) {
    case 'JET_CONNECT_REQUEST':
      return {in: 0, out: 0}
    case 'JET_DEBUG':
      let newState = {...state}
      newState[action.direction] += action.string.length
      return newState
    default:
      return state
  }
}

const selectedFields = (state = [], action) => {
  if (action.type === 'SELECTED_FIELDS_SET') {
    return action.fields
  }
  return state
}

const data = combineReducers({
  favorites: sorted('favorites'),
  search: sorted('search'),
  groups: single('groups'),
  group: array('group'),
  messages,
  traffic
})

const version = (state = '1.0.0') => {
  return state
}

const settings = combineReducers({search, favorites, connection, connections, version, selectedFields})

const radar = combineReducers({settings, data, message})

export const getFilteredStatesAndMethods = (statesAndMethods, searchTerms) => {
  const lsearchTerms = searchTerms.map(term => term.toLowerCase())
  const matchesSearch = (path) => {
    const lpath = path.toLowerCase()
    const matches = lsearchTerms.reduce((prev, term) => {
      return prev && lpath.match(term)
    }, true)
    return matches
  }
  return statesAndMethods.filter(el => matchesSearch(el.path))
}

export default radar
