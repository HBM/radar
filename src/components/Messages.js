import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { withRouter } from 'react-router'
import { Icon, List, Row } from 'hbm-react-components'
import { Split, SplitRight, SplitLeft } from './Split'
import moment from 'moment'

const isRequest = (message) => {
  if (message.method && typeof message.id !== 'undefined') {
    return true
  }
  return false
}

const isResponse = (message) => {
  if (!message.method && typeof message.id !== 'undefined') {
    return true
  }
  return false
}

const isNotification = (message) => {
  if (!message.method && typeof message.id === 'undefined') {
    return true
  }
  return false
}

class Messages extends React.Component {

  toMessageRow = (message) => {
    const icon = message.direction === 'in' ? <Icon.FlightLand /> : <Icon.FlightTakeoff />
    let primary
    if (Array.isArray(message.json)) {
      primary = `Batch Message - ${message.string.length} bytes`
    } else {
      primary = `Single Message - ${message.string.length} bytes`
    }


    const onSelect = () => {
      // this.props.router.push('/messages/' + encodeURIComponent(message))
    }
      console.log(message)

    return (
      <Row
        primary={primary}
        secondary={moment(message.timestamp).fromNow()}
        key={message.id}
        icon={icon}
        onFocus={onSelect}
      />
    )
  }

  render () {
    const {children, messages} = this.props

    return (
      <Split className='Favorites'>
        <SplitLeft>
          <List>
            {
              messages.map(this.toMessageRow)
            }
          </List>
        </SplitLeft>
        <SplitRight>
          {children && React.cloneElement(children, {messages})}
        </SplitRight>
      </Split>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.data.messages
  }
}

export default withRouter(connect(mapStateToProps, {...actions})(Messages))
