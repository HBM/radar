import React from 'react'

const getSelected = (messages, id) => {
  return messages.find(message => {
    return message.id === id
  })
}

const Message = ({params: {id}, messages}) => {
  const message = getSelected(messages, id)
  return (
    <textarea disabled>{JSON.stringify(message, null, '\t')}</textarea>
  )
}

export default Message
