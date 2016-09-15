import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Header, Navigation, Snackbar, Icon} from 'hbm-react-components'

class App extends React.Component {

  state = {
    subtitle: 'Search',
    snackbarVisible: false
  }

  onChange = (link) => {
    this.setState({subtitle: link.text})
  }

  componentWillUnmound () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.message !== this.props.message) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.setState({snackbarVisible: false})
      }, 4000)
      this.setState({snackbarVisible: true})
    }
  }

  hideSnackbar = () => {
    this.setState({snackbarVisible: false})
  }

  render () {
    const {groups, message} = this.props
    const groupToLink = (group) => {
      return {
        text: group.title,
        link: '/groups/' + encodeURIComponent(group.title)
      }
    }
    var links = [
      {text: 'Search', link: '/'},
      {text: 'Favorites', link: '/favorites'}
    ]

    if (groups && groups.length > 0) {
      links.push({text: 'Groups', link: '/groups', links: groups.map(groupToLink)})
    }
    links.push({text: 'Messages', link: '/messages'})
    return (
      <div>
        <Header title='Radar' subtitle={this.state.subtitle} >
          <Link to='/connections' onClick={() => { this.setState({subtitle: 'Settings'}) }} >
            <Icon.Settings fill='white' />
          </Link>
        </Header>
        <Navigation links={links} onChange={this.onChange} />
        <main>
          {this.props.children}
        </main>
        <Snackbar
          text={message && message.text}
          action='Dismiss'
          onAction={this.hideSnackbar}
          visible={this.state.snackbarVisible}
          />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.data.groups,
    message: state.message
  }
}

export default connect(mapStateToProps)(App)
