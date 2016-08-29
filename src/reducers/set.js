let changing = []

const set = (state = {}, action) => {
  switch (action.type) {
    case 'STATE_SET_REQUEST':
      changing[action.path] = true
      return {
        path: action.path,
        value: action.value
      }
    case 'STATE_SET_SUCCESS':
      delete changing[action.path]
      return {
        path: action.path,
        value: action.value
      }
    case 'STATE_SET_FAILURE':
      delete changing[action.path]
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}

export const getIsSetting = (path) => changing[path]

export default set
