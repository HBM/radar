import React, { useEffect, useState } from 'react'
import { Textfield, Checkbox } from 'md-components'

const TypedInput = (props) => {
  const [bak, setBak] = useState(props.value)
  const [value, setValue] = useState(props.value)
  const [type, setType] = useState(typeof props.value)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (bak !== props.value) {
      setBak(props.value)
      setValue(props.value)
      setType(typeof props.value)
      setError(false)
    }
  }, [props.value])

  const onChangeNumber = (target) => {
    if (target.value.endsWith('.')) {
      setError(false)
      props.onError(props.name, false)
    }
    const value = parseFloat(target.value)
    if (!isNaN(value) && target.value.match(/^[-+]?[0-9]*\.?[0-9]+$/)) { // regex from here: http://www.regular-expressions.info/floatingpoint.html
      setError(false)
      props.onChange(props.name, value)
      props.onError(props.name, false)
    } else {
      setError('Not a number')
      props.onError(props.name, true)
    }
  }

  const onChange = ({ target }) => {
    setValue(target.value)
    switch (type) {
      case 'boolean':
        props.onChange(props.name, target.checked)
        break
      case 'number':
        onChangeNumber(target)
        break
      default:
        props.onChange(props.name, target.value)
    }
  }
  if (type === 'boolean') {
    return <Checkbox {...props} checked={value} onChange={onChange} />
  } else {
    return <Textfield {...props} value={value} onChange={onChange} error={error} />
  }
}

export default TypedInput
