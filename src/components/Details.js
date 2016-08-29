import React from 'react'
import State from './State'
import Method from './Method'
import { connect } from 'react-redux'

const getSelected = (statesOrMethods, path) => {
  return statesOrMethods.filter((stateOrMethod) => {
    return stateOrMethod.path === decodeURIComponent(path)
  })[0]
}

const Details = ({params: {path}, methods, states}) => {
  // const method = getSelected(methods, path)
  const state = getSelected(states, path)
  const method = getSelected(methods, path)
  if (state) {
    return <State state={state} />
  }
  if (method) {
    return <Method method={method} />
  }
  return <div></div>
}

const mapStateToProps = (state) => {
  return {
    states: state.states,
    methods: state.methods
  }
}

export default connect(mapStateToProps)(Details)
