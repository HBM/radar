import React from 'react'
import { connect } from 'react-redux'
import { Icon, Chip } from 'md-components'
import { setSelectedFields } from '../actions'
import classNames from 'classnames'
import Collapse from 'react-collapse'
import FieldSelection from './FieldSelection'

class SearchBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      focused: false,
      visible: false
    }
  }

  onFocus = () => {
    this.setState({focused: true})
  }

  onBlur = () => {
    this.setState({focused: false})
  }

  onChange = (value) => {
    this.props.onChange(value.map(v => v.text))
  }

  toggle = () => {
    this.setState({visible: !this.state.visible})
  }

  render () {
    const {terms, onSubmit, statesAndMethods, selectedFields, setSelectedFields} = this.props
    const spaceCode = 32
    const enterCode = 13
    const termsChips = terms.map(term => { return {text: term} })

    let chips
    return (
      <div>
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
            placeholder={terms.length === 0 ? 'Enter path fragments' : ''}
            value={termsChips}
            delimiters={[spaceCode, enterCode]}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoFocus
            />
          <Icon.Button onClick={this.toggle}
            disabled={statesAndMethods.length === 0}
            style={{padding: 0}}
            className={classNames('IconButton', {collapsed: this.state.visible})}
            >
            <Icon.FilterList className='Icon' />
          </Icon.Button>
        </form>
        <Collapse isOpened={this.state.visible} >
          <FieldSelection selected={selectedFields} states={statesAndMethods} onChange={setSelectedFields} />
        </Collapse>
      </div>
	)
  }
}

const mapStateToProps = (state) => ({
  selectedFields: state.settings.selectedFields
})

export default connect(mapStateToProps, {setSelectedFields})(SearchBar)
