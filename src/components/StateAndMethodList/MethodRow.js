import React from 'react'
import { Row } from 'md-components'

const methodAvatar = <span className='Method-avatar'>M</span>

const MethodRow = ({method, icon, link}) => (
  <Row
    onClick={() => {}} // iOS Safari does not get focus event if no click handler is installed
    avatar={methodAvatar}
    primary={method.path}
    secondary='Method'
    icon={icon}
    linkTo={link}
	/>
)

export default MethodRow
