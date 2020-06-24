import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Icon, Chip } from 'md-components'
import { setSelectedFields } from '../actions'
import classNames from 'classnames'
import Collapse from 'react-collapse'
import FieldSelection from './FieldSelection'

const SearchBar = (props) => {
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const chips = useRef(null)

  const onFocus = () => {
    setFocused(true)
  }

  const onBlur = () => {
    setFocused(false)
  }

  const onChange = (value) => {
    props.onChange(value.map(v => v.text))
  }

  const toggle = () => {
    setVisible(!visible)
  }
  const { terms, onSubmit, statesAndMethods, selectedFields, setSelectedFields } = props
  const spaceCode = 32
  const enterCode = 13
  const termsChips = terms.map(term => { return { text: term } })

  return (
    <div>
      <form
        className={classNames('Searchbar', { 'Searchbar--focused': focused })}
        onSubmit={onSubmit}
        onClick={() => chips.current.input.focus()}
      >
        <button type='submit' style={{ display: 'none' }} onSubmit={onSubmit} />
        <div className='Searchbar-icon'>
          <Icon.Search width={36} height={36} />
        </div>
        <Chip
          ref={chips}
          onChange={onChange}
          placeholder={terms.length === 0 ? 'Enter path fragments' : ''}
          value={termsChips}
          delimiters={[spaceCode, enterCode]}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus
        />
        <Icon.Button
          onClick={toggle}
          disabled={statesAndMethods.length === 0}
          style={{ padding: 0 }}
          className={classNames('IconButton', { collapsed: visible })}
        >
          <Icon.FilterList className='Icon' />
        </Icon.Button>
      </form>
      <Collapse isOpened={visible}>
        <FieldSelection selected={selectedFields} states={statesAndMethods} onChange={setSelectedFields} />
      </Collapse>
    </div>
  )
}

const mapStateToProps = (state) => ({
  selectedFields: state.settings.selectedFields
})

export default connect(mapStateToProps, { setSelectedFields })(SearchBar)
