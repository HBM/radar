import * as api from '../api'

export const connect = ({url, user, password}) => (dispatch) => {
  dispatch({type: 'JET_CONNECT_REQUEST', url, user, password})

  return api.connect({url, user, password}).then(
    (response) => {
      dispatch({type: 'JET_CONNECT_SUCCESS', url, user, password})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'JET_CONNECT_FAILURE', url, user, message})
    })
}

export const close = ({url, user, password}) => {
  api.close({url, user, password})
  return {type: 'JET_CLOSE', url, user, password}
}

export const unfetch = ({url, user, password}, id) => {
  api.unfetch({url, user, password}, id)
  return {type: 'JET_UNFETCH', url, user, password, id}
}

export const fetch = (connection, fetchExpression, id) => (dispatch) => {
  dispatch({type: 'JET_FETCHER_REQUEST', fetchExpression, id})

  const onData = (...data) => {
    if (data.length === 2) {
      dispatch({type: 'JET_FETCHER_CONTENT_CHANGE', data: data[0], fetcher: data[1], id})
    } else {
      dispatch({type: 'JET_FETCHER_CONTENT_CHANGE', path: data[0], event: data[1], value: data[2], fetcher: data[3], id})
    }
  }

  return api.fetch(connection, fetchExpression, id, onData).then(
    (response) => {
      dispatch({type: 'JET_FETCHER_SUCCESS', fetchExpression, id})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'JET_FETCHER_FAILURE', fetchExpression, message, id})
    })
}

export const set = (connection, path, value) => (dispatch) => {
  dispatch({type: 'JET_SET_REQUEST', path, value})

  return api.set(connection, path, value).then(
    () => {
      dispatch({type: 'JET_SET_SUCCESS', path, value})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'JET_SET_FAILURE', path, message})
    })
}

export const call = (connection, path, args) => (dispatch) => {
  dispatch({type: 'JET_CALL_REQUEST', path, args})

  return api.call(connection, path, args).then(
    (result) => {
      dispatch({type: 'JET_CALL_SUCCESS', path, args, result})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'JET_CALL_FAILURE', path, args, message})
    })
}

