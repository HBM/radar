import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Textfield, Button, Icon } from 'md-components'
import { flatObject, unflatObject, flatToNameValue, toHex, isInt } from './helpers'
import TypedInput from './TypedInput'

const createInput = (onChange, disabled, onError) => (nvp) => {
  switch (typeof nvp.value) {
    case 'string':
    case 'boolean': {
      return (
        <TypedInput
          disabled={disabled}
          name={nvp.name}
          value={nvp.value}
          label={nvp.name}
          onChange={onChange}
          key={nvp.name}
          onError={onError}
        />
      )
    }
    case 'number': {
      return (
        <div className='State-Input-Dec-Hex' key={nvp.name}>
          <TypedInput
            disabled={disabled}
            name={nvp.name}
            type='string'
            value={nvp.value}
            label={nvp.name}
            onChange={onChange}
            key={nvp.name + '_dec'}
            onError={onError}
          />
          {
            isInt(nvp.value) &&
              <Textfield
                disabled
                name={nvp.name}
                type='text'
                value={toHex(nvp.value)}
                label={nvp.name ? 'As HEX' : null}
                key={nvp.name + '_hex'}
              />
          }
        </div>
      ) }
    default:
    { return <div>unsported type {typeof nvp.value}</div> }
  }
}

const State = (props) => {
  const [formData, setFormData] = useState(props.state.value)
  const [formDataBak, setFormDataBak] = useState(props.state.value)
  const [path, setPath] = useState(props.state.path)
  const [error, setError] = useState({})

  useEffect(() => {
    if (!hasChanges() || path !== props.state.path) {
      setFormData(flatObject(props.state.value))
      setError({})
    }
    setPath(props.state.path)
    setFormDataBak(flatObject(props.state.value))
  }, [props.state.value, props.state.path])

  const hasChanges = () => JSON.stringify(formData) !== JSON.stringify(formDataBak)
  const cancel = () => setFormData(flatObject(unflatObject(formDataBak)))

  const onSubmit = (event) => {
    event.preventDefault()
    // set formDataBak = formData so that hasChanges() => false
    // and UNSAFE_componentWillReceiveProps updates formData and formDataBak
    setFormDataBak(formData)
    props.set(props.connection, path, unflatObject(formData))
  }

  const assignToFormData = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const onError = (name, hasError) => {
    setError({ ...error, [name]: hasError })
  }

  const hasError = () => Object.keys(error).reduce((prev, name) => prev || error[name], false)

  const nvps = flatToNameValue(formData)
  return (
    <div className='State'>
      <div className='State-hero'>
        <Icon.Button>
          <Link to={props.backUrl} />
          <Icon.ChevronLeft width={30} height={30} className='Split-right-back' />
        </Icon.Button>
        <h1>{path}</h1>
      </div>
      <form onSubmit={onSubmit}>
        {nvps.map(createInput(assignToFormData, props.state.fetchOnly, onError))}
        <hr />
        <Button type='submit' raised disabled={!(hasChanges() && !hasError())}>Set</Button>
        <Button type='button' disabled={!hasChanges() && !hasError()} onClick={cancel}>Cancel</Button>
      </form>
    </div>
  )
}

export default State
