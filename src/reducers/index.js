import { combineReducers } from 'redux'
import states from './states'
import connection, * as fromConnection from './connection'
import fetcher, * as fromFetcher from './fetcher'

const gui = (state = {} , action) => {
  switch (action.type) {
    case 'CONNECT_SUCCESS':
      return {
        showConnection: false
      }
    case 'SHOW_CONNECTION':
      return {
        showConnection: true
      }
    default:
      return state
  }
}

const radar = combineReducers({states, fetcher, connection, gui})

export default radar

export const getIsConnecting = (url) => fromConnection.getIsConnecting(url)
export const getIsChangingFetcher = () => fromFetcher.getIsChanging()
export const getIsSettingState = (path) => states.getIsSetting(path)
