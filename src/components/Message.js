import React from 'react'
import { Icon, Textfield } from 'md-components'

const Message = ({message, onClose}) => {
  const jsonString = JSON.stringify(message.json, null, '  ')
  return (
    <div className='State'>
      <div className='State-hero'>
        <Icon.Button onClick={onClose} >
          <Icon.ChevronLeft width={30} height={30} className='Split-right-back' />
        </Icon.Button>
        <h1>#{message.uid} - {message.type}</h1>
      </div>
      <form onSubmit={() => {}}>
        <Textfield disabled value={message.direction} label='Direction' />
        <Textfield disabled value={message.timestamp.toString()} label='Timestamp' />
        <Textfield disabled value={JSON.stringify(message.json).length} label='Bytes' />
        <textarea rows={jsonString.match(/\n/g).length + 1} value={jsonString} disabled />
      </form>
    </div>
  )
}

export default Message
