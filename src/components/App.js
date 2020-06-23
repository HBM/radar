import React, { useState, useRef, useEffect } from 'react'
import {connect} from 'react-redux'
import {Link, Route, Redirect, withRouter, Switch, NavLink} from 'react-router-dom'
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

const App = (props) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const timeoutId = useRef(0)

  useEffect(() => {
    window.clearTimeout(timeoutId.current)

    timeoutId.current = window.setTimeout(() => {
      setSnackbarVisible(false)
    }, 4000)
    setSnackbarVisible(true)

    return () => {
      window.clearTimeout(timeoutId.current)
    }
  }, [props.message])

  const copyLocationToClipboard = () => {
    const span = document.createElement('span')
    const {origin, pathname, hash} = window.location
    const link = `${origin}${pathname}${hash.split('?')[0]}?connection=${encodeURIComponent(JSON.stringify(props.connection))}`
    span.setAttribute('data-clipboard-text', link)
    const cb = new Clipboard(span)
    span.click()
    span.remove()
    cb.destroy()
    props.copiedToClipboard()
  }

  const hideSnackbar = () => {
    setSnackbarVisible(false)
  }

  const {groups, message} = props
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
  links.push({text: 'Settings', link: '/connections', isHeader: true})

  return (
    <div>
      <Switch>
        {links.map(({text, link}, index) => (
          <Route key={index} path={link} render={(() => (
            <Header title='Radar' subtitle={text} >
              <Button onClick={copyLocationToClipboard} disabled={!props.connection} >
                <Icon.Link fill={props.connection ? 'white' : 'gray'} />
              </Button>
              <Link to='/connections' replace>
                <Icon.Settings fill='white' />
              </Link>
            </Header>
          ))} />
        ))}
      </Switch>
      <Route path='/' render={() => (
        <Navigation>
          {links.filter(item => !item.isHeader).map(({text, link, links}, index) => {
            if (links) {
              return (
                <Navigation.Group key={index} title={text}>
                  {links.map((item, index) => <NavLink key={index} replace to={`${link}${item.link}`}>{item.text}</NavLink>)}
                </Navigation.Group>
            ) }
            return (<NavLink key={index} replace to={link}>{text}</NavLink>)
          })}
        </Navigation>
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
        onAction={hideSnackbar}
        visible={snackbarVisible}
      />
    </div>
  )
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
