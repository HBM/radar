import React from 'react'
import { Row } from 'md-components'
import flatten from 'flat'
import { useHistory } from 'react-router-dom'

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

const StateRow = ({state, icon, link, fields}) => {
  const history = useHistory()
  return (
    <Row
      onClick={() => {
        if (history.location.pathname === link) {
          history.replace(link)
        } else {
          history.push(link)
        }
      }}
      onFocus={() => {}}
      avatar={stateAvatar}
      primary={state.path}
      secondary={<StatePreviewFields stateValue={state.value} fields={fields} />}
      icon={icon}
    />
  )
}

export default StateRow

