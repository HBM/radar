import React from 'react'
import { Row } from 'md-components'
import flatten from 'flat'

const stateAvatar = <span className='State-avatar'>S</span>

const StatePreviewFields = ({stateValue, fields = []}) => {
  let content
  let contentEmpty
  if (typeof stateValue === 'object') {
    const flat = flatten(stateValue)
    if (fields.length === 0) {
      fields = Object.keys(flat).slice(0, 3)
    }
    content = fields.map(field => {
      return flat[field] !== undefined ? <span className='State-field' key={field} >
        <span className='State-field-name'>{field}:</span>
        <span className='State-field-value'>{JSON.stringify(flat[field])}</span>
      </span> : null
    })
    contentEmpty = content.find(child => child !== null) === undefined
  } else {
    content = <span className='State-field'><span className='State-field-value'>{JSON.stringify(stateValue)}</span></span>
    contentEmpty = false
  }
  return <div>{contentEmpty ? 'No matching fields' : content}</div>
}

const StateRow = ({state, icon, link, fields}) => (
  <Row
    onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
    avatar={stateAvatar}
    primary={state.path}
    secondary={<StatePreviewFields stateValue={state.value} fields={fields} />}
    icon={icon}
    linkTo={link}
  />
)

export default StateRow

