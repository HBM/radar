import React from 'react'
import flatten from 'flat'
import { Textfield, Button, Checkbox} from 'hbm-react-components'

const flatObject = (value) => {
  if (typeof value === 'object') {
    return flatten(value)
  } else {
    var fv = {}
    fv[''] = value
    return fv
  }
}

const toNameValue = (flat) => {
  return Object.keys(flat)
    .sort(function(a, b) {
      return a - b
    })
    .map(function(key) {
      return {name: key, value: flat[key]}
    })
}

const createInput = (nvp) => {
  switch (typeof nvp.value) {
    case 'string':
    case 'number':
      return <Textfield
        name={nvp.name}
        type={typeof nvp.value === 'string' ? 'text' : 'number'}
        defaultValue={nvp.value}
        label={nvp.name}
      />
    case 'boolean':
      return <Checkbox
        name={nvp.name}
        checked={nvp.value}
        label={nvp.name}
      />
    default: 
      return <Textfield
        name={nvp.name}
        type='text'
        disabled={true}
        value={nvp.value}
        label={nvp.name}
      />
  }
}

export default class State extends React.Component {
  onSubmit = (event) => {
		  console.log('submit', event)
  }
  render () {
    const nvps = toNameValue(flatObject(this.props.state.value))
    return (
      <div className='State'>
       <div className='State-hero'>
         <h1>{this.props.state.path}</h1>
       </div>
       <form onSubmit={this.onSubmit} >
         {nvps.map(createInput)}
		 <hr />
         <Button type='submit' raised>Apply</Button>
       </form>
      </div>
    )
  }
}

/*
class State extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.createState(this.props.item.value)
  }

  createState (value) {
    this.shouldUpdate = true
    return {
      value: flatObject(value),
      displayValue: flatObject(value),
      displayJsonValue: JSON.stringify(value, null, ' '),
      dirty: false,
      newValue: value
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.item !== nextProps.item) {
      this.setState(this.createState(nextProps.item.value))
    }
    if (nextProps.item.setResponse) {
      if (nextProps.item.setResponse.error) {
        this.setState(this.createState(nextProps.item.value))
      }
      this.setState({
        response: nextProps.item.setResponse
      })
    }
  }

  shouldComponentUpdate () {
    return this.shouldUpdate
  }

  onChange (key, event) {
    var value = event.target.typedValue
    this.state.response = null
    this.state.value[key] = value
    this.state.displayValue[key] = value
    this.shouldUpdate = true
    if (Object.keys(this.state.value).length === 1 && this.state.value[''] !== undefined) {
      this.state.newValue = this.state.value['']
    } else {
      this.state.newValue = flatten.unflatten(this.state.value)
    }
    this.setState(this.state)
  }

  renderResponse () {
    if (!this.state.response) {
      return
    } else if (this.state.response.error) {
      return <Response value={this.state.response} />
    }
  }

  renderFetchOnly () {
    if (this.props.item.fetchOnly) {
      //			return <button className='btn' disabled>fetch-only</button>
    }
  }

  hasChanges () {
    return JSON.stringify(this.props.item.value) !== JSON.stringify(this.state.newValue)
  }

  renderButton () {
    //		if (this.props.item.fetchOnly) {
    //			return <button disabled className='btn'>Fetch-Only</button>
    //		} else {
    var props = {}
    props.disabled = !this.hasChanges()
    props.onClick = this.set.bind(this)
    return <button {...props} className='waves-effect btn'>
             Set
           </button>
  //		}
  }

  renderSwitch () {
    var toggleJson = (event) => {
      this.shouldUpdate = true
      this.setState({
        showJson: event.target.checked
      })
    }
    var style = {
      marginBottom: '20px'
    }
    return (
      <div className='right switch' style={style}>
        <label>
          Flat
          <input type='checkbox' onClick={toggleJson} />
          <span className='lever'></span> JSON
        </label>
      </div>
    )
  }

  onJsonChange (newValue) {
    this.setState(this.createState(newValue))
  }

  renderJsonText () {
    if (!this.state.showJson) {
      return
    }
    var onChange = this.onJsonChange.bind(this)
    return <JsonTextArea onChange={onChange} value={this.state.newValue} />
  }

  renderJson () {
    if (this.state.showJson) {
      return
    }
    var items = Object.keys(this.state.displayValue).map((key) => {
      var value = this.state.displayValue[key]
      var onChange = this.onChange.bind(this, key)
      var readOnly = this.props.item.fetchOnly
      return <AutoTypeInput
               value={value}
               label={key}
               onChange={onChange}
               readOnly={readOnly}
               key={key} />
    })
    return items
  }

  set (event) {
    event.preventDefault()
    this.props.set(this.state.newValue)
  }

  render () {
    this.shouldUpdate = false
    var away = {
      position: 'absolute',
      left: '-9999px'
    }
    var item = this.props.item
    var lastChange = item.lastChange.toLocaleTimeString()
    var changes = item.count - 1
    const statusLine = '' + changes + ' Changes / ' + lastChange
    const statusLineStyle = {
      fontWeight: '200'
    }
    const headlineStyle = {
      fontSize: '1.2em'
    }
    const cardActionStyle = {
      height: '100px'
    }
    return (
      <div className='card'>
        <div className='card-content'>
          <span className='card-title grey-text text-darken-2' style={headlineStyle}>{this.props.item.path}</span>
          <form className='row' onSubmit={this.set.bind(this)} disabled={item.fetchOnly}>
            {this.renderJsonText()}
            {this.renderJson()}
            <input type='submit' style={away} />
          </form>
        </div>
        <div className='card-action' style={cardActionStyle}>
          {this.renderResponse()}
          {this.renderButton()}
          {this.renderFetchOnly()}
          <span className='right amber-text text-lighten-1' style={statusLineStyle}>{statusLine}</span>
          <div>
            {this.renderSwitch()}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = State
*/
