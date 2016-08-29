import React from 'react'
import { Icon, Chip } from 'hbm-react-components'
import classNames from 'classNames'

export default class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      focused: false
    }
  }

  onFocus = () => {
    this.setState({focused: true})
  }

  onBlur = () => {
    this.setState({focused: false})
  }

  render () {
    const {onChange, initialValues, onSubmit} = this.props
    const spaceCode = 32
    const enterCode = 13

    let chips
    return (
      <form
        className={classNames('Searchbar', {'Searchbar--focused': this.state.focused})}
        onSubmit={onSubmit}
        onClick={() => chips.input.focus()}
        >
        <button type='submit' style={{display: 'none'}} onSubmit={onSubmit} />
        <div className='Searchbar-icon'>
          <Icon.Search width={36} height={36} />
        </div>
        <Chip
          ref={(s) => { chips = s }}
          onChange={onChange}
          initialValues={initialValues}
          delimiters={[spaceCode, enterCode]}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          autoFocus
          />
      </form>
	)
  }
}
