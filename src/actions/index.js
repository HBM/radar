import { getIsChangingFetcher, getIsSettingState, getIsConnecting } from '../reducers'
import * as api from '../api'

export const connect = ({url, user, password}) => (dispatch) => {
  if (getIsConnecting(url)) {
    return Promise.resolve()
  }
  dispatch({type: 'CONNECT_REQUEST', url, user, password})

  return api.connect(url, user, password).then(
    (response) => {
      dispatch({type: 'CONNECT_SUCCESS', url, user, password})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'CONNECT_FAILURE', url, user, message})
    })
}

export const changeFetcher = (fetchExpression) => (dispatch) => {
  if (getIsChangingFetcher()) {
    return Promise.resolve()
  }

  dispatch({type: 'FETCHER_REQUEST', fetchExpression})

  const onChange = (content) => {
    dispatch({type: 'FETCHER_CONTENT_CHANGE', content})
  }

  return api.changeFetcher(fetchExpression, onChange).then(
    (response) => {
      dispatch({type: 'FETCHER_SUCCESS', fetchExpression})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'FETCHER_FAILURE', fetchExpression, message})
    })
}

export const setState = (path, value) => (dispatch) => {
  if (getIsSettingState(path)) {
    return Promise.resolve()
  }

  dispatch({type: 'STATE_SET_REQUEST', path, value})

  return api.setState(path, value).then(
    (response) => {
      dispatch({type: 'STATE_SET_SUCCESS', path, value})
    },
    (error) => {
      const message = error.message || 'Something went wrong'
      dispatch({type: 'STATE_SET_FAILURE', path, message})
    })
}

export const showConnection = () => ({
  type: 'SHOW_CONNECTION'
})

export const addFavorite = (path) => ({
  type: 'FAVORITE_ADD',
  path
})

export const removeFavorite = (path) => ({
  type: 'FAVORITE_REMOVE',
  path
})

export const toggleFavorite = (path) => ({
  type: 'FAVORITE_TOGGLE',
  path
})

export const setSearch = (search) => ({
  type: 'SEARCH_SET',
  search
})
