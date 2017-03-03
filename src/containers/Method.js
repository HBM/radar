import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import Method_ from '../components/Method'

const mapStateToProps = state => {
  return {
    favorites: state.settings.favorites,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, actions)(Method_)
