let changing = false

const fetcher = (state = {}, action) => {
  switch (action.type) {
    case 'FETCHER_REQUEST':
      changing = true
      return {
        expression: action.fetchExpression
      }
    case 'FETCHER_SUCCESS':
      changing = false
      return state
    case 'FETCHER_FAILURE':
      changing = false
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}

export const getIsChanging = () => changing

export default fetcher
