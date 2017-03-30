import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, Redirect, withRouter, Switch} from 'react-router-dom'
import {Header, Navigation, Snackbar, Icon, Button} from 'md-components'
import Search from './Search'
import Favorites from './Favorites'
import Connections from './Connections'
import Group from './Group'
import Messages from './Messages'
import ImportExport from './ImportExport'
import Clipboard from 'clipboard'
import '../styles.scss'
import {copiedToClipboard} from '../actions'

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

  copyLocationToClipboard = () => {
    const span = document.createElement('span')
    const {origin, pathname, hash} = window.location
    const link = `${origin}${pathname}${hash.split('?')[0]}?connection=${encodeURIComponent(JSON.stringify(this.props.connection))}`
    span.setAttribute('data-clipboard-text', link)
    const cb = new Clipboard(span)
    span.click()
    span.remove()
    cb.destroy()
    this.props.copiedToClipboard()
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
      {text: 'Search', link: '/search'},
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
          <Button onClick={this.copyLocationToClipboard} disabled={!this.props.connection} >
            <Icon.Link fill={this.props.connection ? 'white' : 'gray'} />
          </Button>
          <Link to='/connections' onClick={() => { this.setState({subtitle: 'Settings'}) }} >
            <Icon.Settings fill='white' />
          </Link>
        </Header>
        <Route path='/' render={(location) => (
          <Navigation location={location} links={links} onChange={this.onChange} />
        )} />
        <main>
          <Switch>
            <Redirect exact from='/' to='/search' />
            <Route path='/search' component={Search} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/connections' component={Connections} />
            <Route path='/groups/:group' component={Group} />
            <Route path='/messages' component={Messages} />
            <Route path='/impex' component={ImportExport} />
          </Switch>
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
  const {url, password, user} = state.settings.connection ? state.settings.connection : {}
  return {
    groups: state.data.groups ? state.data.groups.value : [],
    message: state.message,
    connection: url && state.settings.connection.isConnected ? {url, password, user} : null
  }
}

export default withRouter(connect(mapStateToProps, {copiedToClipboard})(App))
