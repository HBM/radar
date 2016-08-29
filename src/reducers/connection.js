let connecting = false

const connection = (state = {isConnected: false}, action) => {
  switch (action.type) {
    case 'CONNECT_REQUEST':
      connecting = action.url
      return {
        isConnected: false,
        url: action.url,
        user: action.user,
        password: action.password
      }
    case 'CONNECT_SUCCESS':
      connecting = false
      return {
        ...state,
        isConnected: true,
        url: action.url,
        user: action.user,
        password: action.password
      }
    case 'CONNECT_FAILURE':
      connecting = false
      return {
        isConnected: false,
        url: action.url,
        error: action.message
      }
    default:
      return state
  }
}

export const getIsConnecting = (url) => connecting === url

export default connection
