import React from 'react'
import FetchForm from './FetchForm.react.jsx'
// import List from './List.react.jsx'
import Login from './Login.react.jsx'

class App extends React.Component {

  render () {
    return (
      <div>
        <Login />
        <FetchForm />
      </div>
    )
  }

  /* TODO: connect actions and reducers to FetchForm and List
  render () {
    return (
      <div>
        <Login />
        <FetchForm />
        <div className='container'>
          <List />
        </div>
      </div>
    )
  } */
}

export default App

