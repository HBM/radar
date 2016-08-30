export const sorted = (id) => (state = [], action) => {
  if (action.id !== id) {
    return state
  }
  switch (action.type) {
    case 'JET_FETCHER_FAILURE':
    case 'JET_FETCHER_REQUEST':
      return []
    case 'JET_FETCHER_CONTENT_CHANGE':
      return [...action.data]
    default:
      return state
  }
}

export const unsorted = (id) => (state = {}, action) => {
  if (action.id !== id) {
    return state
  }
  switch (action.type) {
    case 'JET_FETCHER_FAILURE':
    case 'JET_FETCHER_REQUEST':
      return []
    case 'JET_FETCHER_CONTENT_CHANGE':
      let newState = {...state}
      if (action.event === 'remove') {
        delete newState[action.path]
      } else {
        newState[action.path] = action.value
      }
      return newState
    default:
      return state
  }
}

