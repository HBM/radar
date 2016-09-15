import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { withRouter } from 'react-router'
import { Icon, List, Row } from 'hbm-react-components'
import { Split, SplitRight, SplitLeft } from './Split'
import { toFormatedMessages } from '../reducers'
import moment from 'moment'

class Messages extends React.Component {

  toMessageRow = (message) => {
    const icon = message.direction === 'in' ? <Icon.FlightLand /> : <Icon.FlightTakeoff />

    return (
      <Row
        primary={message.type}
        secondary={moment(message.timestamp).fromNow()}
        key={message.uid}
        icon={icon}
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
    messages: toFormatedMessages(state.data.messages)
  }
}

export default withRouter(connect(mapStateToProps, {...actions})(Messages))
