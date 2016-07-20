import { combineReducers } from 'redux'
import states from './states'
import config from './config'

const radar = combineReducers({states, config})

export default radar

export const getIsConnecting = (url) => config.getIsConnecting(url)
export const getIsChangingFetcher = () => config.getIsChangingFetcher()
export const getIsSettingState = (path) => states.getIsSettingState()
