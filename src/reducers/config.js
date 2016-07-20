import { combineReducers } from 'redux'
import connection, * as fromConnection from './connection'
import fetcher, * as fromFetcher from './fetcher'

const config = combineReducers({connection, fetcher})

export default config

export const getIsConnecting = fromConnection.getIsConnecting
export const getIsFetcherChanging = fromFetcher.getIsChanging
