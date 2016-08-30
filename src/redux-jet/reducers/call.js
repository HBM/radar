let calling = []

const call = (state = {}, action) => {
  switch (action.type) {
    case 'METHOD_CALL_REQUEST':
      calling[action.path] = true
      return {
        path: action.path,
        args: action.value
      }
    case 'METHOD_CALL_SUCCESS':
      delete calling[action.path]
      return {
        path: action.path,
        args: action.value,
        result: action.result
      }
    case 'METHOD_CALL_FAILURE':
      delete calling[action.path]
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}

export const getIsCalling = (path) => calling[path]

export default call
