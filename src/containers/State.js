import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import State_ from '../components/State'

const mapStateToProps = state => {
  return {
    favorites: state.settings.favorites,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, actions)(State_)
