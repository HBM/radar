import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

const Fetch = ({fetchExpression, changeFetcher}) => {
  let input

  const onChange = (event) => {
    event.preventDefault()
    input = event.target.value
  }

  const onSubmit = (event) => {
    event.preventDefault()
    changeFetcher(input)
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type='text'
        defaultValue={fetchExpression}
        onChange={onChange}
        autoFocus />
      <button type='submit'>
        Fetch
      </button>
    </form>
  )
}

const mapStateToProps = (state) => {
  return {
    fetchExpression: state.fetcher.expression
  }
}

export default connect(mapStateToProps, actions)(Fetch)
