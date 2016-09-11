import React from 'react'
import { Icon, Chip } from 'hbm-react-components'
import classNames from 'classnames'

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

  onChange = (value) => {
    console.log('C', value)
    this.props.onChange(value.map(v => v.text))
  }

  render () {
    const {terms, onSubmit} = this.props
    const spaceCode = 32
    const enterCode = 13
    const termsChips = terms.map(term => { return {text: term} })

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
          onChange={this.onChange}
          placeholder='Enter path fragments'
          value={termsChips}
          delimiters={[spaceCode, enterCode]}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          autoFocus
          />
      </form>
	)
  }
}
