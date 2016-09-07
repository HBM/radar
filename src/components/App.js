import React from 'react'
import {connect} from 'react-redux'
import {Header, Navigation} from 'hbm-react-components'

class App extends React.Component {

  state = {
    subtitle: 'Search'
  }

  onChange = (link) => {
    this.setState({subtitle: link.text})
  }

  render () {
    const groupToLink = (group) => {
      return {
        text: group.title,
        link: '/groups/' + encodeURIComponent(group.title)
      }
    }
    var links = [
      {text: 'Search', link: '/'},
      {text: 'Favorites', link: '/favorites'},
      {text: 'Connection', link: '/connection'}
    ]

    if (this.props.groups && this.props.groups.length > 0) {
      links.push({text: 'Groups', link: '/groups', links: this.props.groups.map(groupToLink)})
    }
    return (
      <div>
        <Header title='Radar' subtitle={this.state.subtitle} />
        <Navigation links={links} onChange={this.onChange} />
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.data.groups
  }
}

export default connect(mapStateToProps)(App)
