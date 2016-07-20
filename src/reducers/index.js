import { combineReducers } from 'redux'
import states from './states'
import connection, * as fromConnection from './connection'
import fetcher, * as fromFetcher from './fetcher'

const radar = combineReducers({states, fetcher, connection})

export default radar

export const getIsConnecting = (url) => fromConnection.getIsConnecting(url)
export const getIsChangingFetcher = () => fromFetcher.getIsChanging()
export const getIsSettingState = (path) => states.getIsSetting(path)
