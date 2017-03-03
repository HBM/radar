import { connect } from 'react-redux'
import _StateAndMethodList from '../components/StateAndMethodList'

const mapStateToProps = state => ({
  favorites: state.settings.favorites
})

export default connect(mapStateToProps)(_StateAndMethodList)
