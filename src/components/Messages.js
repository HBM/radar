import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { withRouter } from 'react-router'
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

class Messages extends React.Component {

  state = {
  }

  toMessageRow = (message) => {
    const avatar = message.direction === 'in' ? avatarIn(message) : avatarOut(message)
    const onSelect = () => {
      this.setState({
        selected: message
      })
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

  componentDidMount () {
    this.interval = setInterval(() => {
      this.forceUpdate()
    }, 10000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    const {messages, traffic} = this.props

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
              messages.map(this.toMessageRow)
            }
          </List>
        </SplitLeft>
        <SplitRight>
          {this.state.selected && <Message message={this.state.selected} onClose={() => this.setState({selected: null})} />}
        </SplitRight>
      </Split>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: toFormatedMessages(state.data.messages),
    traffic: state.data.traffic
  }
}

export default withRouter(connect(mapStateToProps, {...actions})(Messages))
