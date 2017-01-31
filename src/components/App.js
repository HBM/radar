import React from 'react'
import {connect} from 'react-redux'
import {Link, Match} from 'react-router'
import {Header, Navigation, Snackbar, Icon} from 'md-components'
import Search from './Search'
import Favorites from './Favorites'
import Connections from './Connections'
import Group from './Group'
import Messages from './Messages'
import ImportExport from './ImportExport'

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
        link: encodeURIComponent(group.title)
      }
    }
    var links = [
      {text: 'Search', link: '/'},
      {text: 'Favorites', link: '/favorites'}
    ]

    try {
      if (groups && groups.length > 0) {
        links.push({text: 'Groups', link: '/groups/', links: groups.map(groupToLink)})
      }
    } catch (err) {
      console.log('Invalid _radarGroups', err)
    }
    links.push({text: 'Messages', link: '/messages'})
    links.push({text: 'Import / Export', link: '/impex'})
    return (
      <div>
        <Header title='Radar' subtitle={this.state.subtitle} >
          <Link to='/connections' onClick={() => { this.setState({subtitle: 'Settings'}) }} >
            <Icon.Settings fill='white' />
          </Link>
        </Header>
        <Match pattern='/' render={(location) => (
          <Navigation location={location} links={links} onChange={this.onChange} />
        )} />
        <main>
          <Match exactly pattern='/' component={Search} />
          <Match pattern='/search' component={Search} />
          <Match pattern='/favorites' component={Favorites} />
          <Match pattern='/connections' component={Connections} />
          <Match pattern='/groups/:group' component={Group} />
          <Match pattern='/messages' component={Messages} />
          <Match pattern='/impex' component={ImportExport} />
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
    groups: state.data.groups ? state.data.groups.value : null,
    message: state.message
  }
}

export default connect(mapStateToProps)(App)
