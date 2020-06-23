import React, {useState} from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { List, Row } from 'md-components'
import { Split, SplitRight, SplitLeft } from './Split'
import { toFormatedMessages } from '../reducers'
import Message from './Message'
import moment from 'moment'

const avatarIn = (message) => (
  <span className='Message-avatar Message-avatar-in'>
    {'#' + message.uid}
  </span>
)

const avatarOut = (message) => (
  <span className='Message-avatar Message-avatar-out'>
    {'#' + message.uid}
  </span>
)

const subheader = (message) => {
  if (message.type === 'Request') {
    return `id: ${message.messageId} - method: ${message.method} - params: ${JSON.stringify(message.params)}`
  } else if (message.type === 'Response') {
    let subheader
    subheader = `id: ${message.messageId} - `
    if (message.error) {
      subheader += `error: ${message.error.message || JSON.stringify(message.error)}`
    } else {
      subheader += `result: ${JSON.stringify(message.result)}`
    }
    return subheader
  } else if (message.type === 'Notification') {
    return `method: ${message.method} - params: ${JSON.stringify(message.params)}`
  }
}

const Messages = ({messages, traffic}) => {
  const [selected, setSelected] = useState(null)

  const toMessageRow = (message) => {
    const avatar = message.direction === 'in' ? avatarIn(message) : avatarOut(message)
    const onSelect = () => {
      setSelected(message)
    }
    return (
      <Row
        primary={`${message.type} - ${JSON.stringify(message.json).length} Bytes`}
        subheader={subheader(message)}
        secondary={moment(message.timestamp).fromNow()}
        key={message.uid}
        avatar={avatar}
        onFocus={onSelect}
      />
    )
  }
  return (
    <Split className='Messages'>
      <SplitLeft>
        <div className='Traffic'>
          <h3>Traffic</h3>
          <div className='Traffic-stats'>
            <div className='Traffic-stat Traffic-stat-in'><span>In:</span><span>{traffic.in} Bytes</span></div>
            <div className='Traffic-stat Traffic-stat-out'><span>Out:</span><span>{traffic.out} Bytes</span></div>
            <div className='Traffic-stat'><span>Total:</span><span>{traffic.in + traffic.out} Bytes</span></div>
          </div>
        </div>
        <List>
          {
            messages.map(toMessageRow)
          }
        </List>
      </SplitLeft>
      <SplitRight>
        {selected && <Message message={selected} onClose={() => setSelected(null)} />}
      </SplitRight>
    </Split>
  )
}

const mapStateToProps = (state) => {
  return {
    messages: toFormatedMessages(state.data.messages),
    traffic: state.data.traffic
  }
}

export default connect(mapStateToProps, {...actions})(Messages)
