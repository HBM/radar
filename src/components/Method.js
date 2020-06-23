import React, { useState } from 'react'
import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Textarea, Icon } from 'md-components'

const Method = (props) => {
  const [args, setArgs] = useState('[]')

  const onSubmit = (event) => {
    event.preventDefault()
    props.call(props.connection, props.method.path, JSON.parse(args))
  }

  const onChange = (event) => {
    setArgs(event.target.value)
  }

  const isValid = () => {
    try {
      const parseArgs = JSON.parse(args)
      return Array.isArray(parseArgs)
    } catch (_) {
      return false
    }
  }

  return (
    <div className='State'>
      <div className='State-hero'>
        <Icon.Button>
          <Link to={props.backUrl} />
          <Icon.ChevronLeft width={30} height={30} className='Split-right-back' />
        </Icon.Button>
        <h1>{props.method.path}</h1>
      </div>
      <form onSubmit={onSubmit} >
        <Textarea
          value={args}
          label='Arguments'
          onChange={onChange}
          error={!isValid() && 'Not a JSON Array'}
        />
        <hr />
        <Button type='submit' raised disabled={!isValid()}>Call</Button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    favorites: state.settings.favorites,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, actions)(Method)
