import React from 'react'
import {
  Header,
  Navigation
} from 'hbm-react-components'


export default class App extends React.Component {

  state = {
    subtitle: 'Fetch'
  }

  onChange = (link) => {
    this.setState({subtitle: link.text})
  }

  render () {
    var links = [
      {text: 'Fetch', link: '/'},
      {text: 'Connection', link: '/connection'}
    ]
    return (
      <div>
        <Header
          title='Radar'
          subtitle={this.state.subtitle}
        />
        <Navigation links={links} onChange={this.onChange} />
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}
