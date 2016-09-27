import React from 'react'
import flatten from 'flat'
import { Checkbox, Button } from 'md-components'

const FieldSelection = ({states, selected, onChange}) => {
  const fieldsObj = states
    .map(state => Object.keys(flatten(state.value || {})))
    .reduce((pre, fields) => {
      fields.forEach(field => {
        pre[field] = true
      })
      return pre
    }, {})
  const fields = Object.keys(fieldsObj) || []
  const _onChange = (event) => {
    let newSelected
    if (event.target.checked) {
      newSelected = [...selected, event.target.name]
    } else {
      const index = selected.indexOf(event.target.name)
      newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)]
    }
    onChange(newSelected)
  }
  return (
    <div className='FieldSelection'>
      <h3>Preview fields</h3>
      <div className='FieldSelection-checkboxes'>
        {
          fields.length === 0 ? 'No fields available'
          : fields.map(field => {
            return <Checkbox
              label={field}
              name={field}
              checked={selected.indexOf(field) > -1}
              key={field}
              onChange={_onChange} />
          })
        }
      </div>
      {fields.length > 0 && <Button raised onClick={() => onChange([])} disabled={selected.length === 0} >Reset</Button>}
    </div>
  )
}

export default FieldSelection
