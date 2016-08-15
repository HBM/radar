import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

const FetchForm = ({fetchExpression, changeFetcher, showConnection}) => {
  const height = '46px'
  const backgroundColor = 'white'
  const color = 'rgb(33,33,33)'

  const iconStyle = {
    backgroundColor: backgroundColor,
    height: height,
    lineHeight: height,
    color: color,
    marginLeft: '1rem'
  }

  const inputStyle = {
    backgroundColor: backgroundColor,
    height: height,
    color: color,
    marginLeft: '2rem',
    width: '100%'
  }

  const formStyle = {
    backgroundColor: backgroundColor,
    height: height,
    lineHeight: height,
    borderRadius: '3px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    width: '80%'
  }

  const containerStyle = {
    position: 'relative',
    height: '100%'
  }

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    right: '1rem'
  }

  const inputFieldStyle = {
    width: '80%'
  }

  let input

  const onChange = (event) => {
    event.preventDefault()
    input = event.target.value
  }

  const onSubmit = (event) => {
    event.preventDefault()
    changeFetcher(input)
  }

  const onLoginClick = (event) => {
    event.preventDefault()
    showConnection()
  }

  return (
    <div className='navbar-fixed'>
      <nav className='cyan darken-3'>
        <div className='nav-wrapper'>
          <div className='container' style={containerStyle}>
            <form
              id='search-form'
              style={formStyle}
              className='z-depth-1 '
              onSubmit={onSubmit}>
              <div className='row'>
                <div className='input-field col active' style={inputFieldStyle}>
                  <i className='prefix mdi-action-search' style={iconStyle}></i>
                  <input
                    type='text'
                    id='containsAllOf'
                    className='active '
                    defaultValue={fetchExpression}
                    onChange={onChange}
                    style={inputStyle}
                    autoFocus />
                </div>
                <button className='btn waves-effect' type='submit' style={buttonStyle}>
                  Fetch
                </button>
              </div>
            </form>
            <ul id='nav-mobile' className='right'>
              <li>
                <a href='#login' className='modal-trigger' onClick={onLoginClick}><i className='material-icons'>account_box</i></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    fetchExpression: state.fetcher.expression
  }
}

export default connect(mapStateToProps, actions)(FetchForm)
