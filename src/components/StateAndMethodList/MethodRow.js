import React, { useMemo } from 'react'
import { Row } from 'md-components'
import { useHistory } from 'react-router-dom'

const methodAvatar = <span className='Method-avatar'>M</span>

const MethodRow = ({ method, icon, link }) => {
  const history = useHistory()
  const row = useMemo(() =>
    <Row
      onClick={() => {
        if (history.location.pathname === link) {
          history.replace(link)
        } else {
          history.push(link)
        }
      }}
      onFocus={() => {}}
      avatar={methodAvatar}
      primary={method.path}
      secondary='Method'
      icon={icon}
    />
  , [method.path])
  return (
    <>{row}</>
  )
}

export default MethodRow
