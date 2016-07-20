let changing = {}

const states = (state = {} , action) => {
  switch (action.type) {
    case 'FETCHER_FAILURE':
    case 'CONNECT_REQUEST':
      return []
    case 'STATE_CHANGE':
      return action.states
    case 'STATE_SET_REQUEST':
      changing[action.path] = true
      return state
    case 'STATE_SET_SUCCESS':
    case 'STATE_SET_FAILURE':
      delete changing[action.path]
      return state
    default:
      return state
  }
}

export default states

export const getIsSetting = (path) => changing[path]
