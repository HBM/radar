import { combineReducers } from 'redux'
import states from './states'
import set, * as fromSet from './set'
import call, * as fromCall from './call'
import methods from './methods'
import connection, * as fromConnection from './connection'
import fetcher, * as fromFetcher from './fetcher'

const jet = combineReducers({states, methods, fetcher, connection, set, call})

export default jet

export const getIsConnecting = (url) => fromConnection.getIsConnecting(url)
export const getIsChangingFetcher = () => fromFetcher.getIsChanging()
export const getIsSettingState = (path) => fromSet.getIsSetting(path)
export const getIsCallingMethod = (path) => fromCall.getIsCalling(path)
