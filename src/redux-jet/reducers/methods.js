let calling = {}

const methods = (state = [], action) => {
  switch (action.type) {
    case 'FETCHER_FAILURE':
    case 'FETCHER_REQUEST':
    case 'CONNECT_REQUEST':
      return []
    case 'FETCHER_CONTENT_CHANGE':
      return action.content.filter((stateOrMethod) => {
        return typeof stateOrMethod.value === 'undefined'
      })
    case 'METHOD_CALL_REQUEST':
      calling[action.path] = true
      return state
    case 'METHOD_CALL_SUCCESS':
    case 'METHOD_CALL_FAILURE':
      delete calling[action.path]
      return state
    default:
      return state
  }
}

export default methods

export const getIsCalling = (path) => calling[path]
