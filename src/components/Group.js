import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { getFilteredStatesAndMethods } from '../reducers'
import * as jetActions from 'redux-jet'
import { Icon } from 'md-components'
import classNames from 'classnames'
import StateAndMethodList from '../containers/StateAndMethodList'
import { Split, SplitRight, SplitLeft } from './Split'
import SearchBar from './SearchBar'
import Details from './Details'
import { Route } from 'react-router-dom'

class Group extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTermsChips: [],
      searchTerms: []
    }
  }

  updateFetch (groups, nextGroup) {
    let group = {...groups.find(group => group.title === nextGroup)}
    if (!group || !group.expression) {
      return
    }
    if (!this.fetching || this.lastGroup !== nextGroup) {
      this.lastGroup = nextGroup
      this.props.unfetch(this.props.connection, 'group')
      this.props.fetch(this.props.connection, group.expression, 'group')
      this.fetching = true
    }
  }

  componentWillMount () {
    if (!this.props.groups) {
      return
    }
    this.updateFetch(this.props.groups, decodeURIComponent(this.props.params.group))
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.groups) {
      return
    }
    this.updateFetch(nextProps.groups, decodeURIComponent(nextProps.params.group))
  }

  componentWillUnmount () {
    this.props.unfetch(this.props.connection, 'group')
    this.fetching = false
  }

  onChange = (terms) => {
    this.setState({searchTermsChips: terms})
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.setSelectedFields([])
    this.setState({searchTerms: this.state.searchTermsChips})
  }

  render () {
    const {statesAndMethods, toggleFavorite, favorites, selectedFields} = this.props

    const filteredStatesAndMethods = getFilteredStatesAndMethods(statesAndMethods, this.state.searchTerms || [])

    const createStar = (path) => {
      return <Icon.Star
        onClick={() => toggleFavorite(path)}
        className={classNames('Icon Fetch Star', {'Star--active': (favorites.indexOf(path) > -1)})}
      />
    }

    return (
      <Split className='Group'>
        <SplitLeft>
          <SearchBar
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            terms={this.state.searchTermsChips}
            statesAndMethods={filteredStatesAndMethods}
            selectedFields={selectedFields}
          />
          <StateAndMethodList statesAndMethods={filteredStatesAndMethods} iconCreator={createStar} rootPath={'/groups/' + encodeURIComponent(this.props.params.group)} selectedFields={selectedFields} />
        </SplitLeft>
        <Route path='/groups/:group/:path' children={({match}) => {
          if (match) {
            return (
              <SplitRight>
                <Details statesAndMethods={statesAndMethods} params={match.params} backUrl={'/groups/' + match.params.group} />
              </SplitRight>
            )
          }
          return <SplitRight />
        }
        } />
      </Split>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.data.groups ? state.data.groups.value : [],
    favorites: state.settings.favorites,
    statesAndMethods: state.data.group,
    connection: state.settings.connection,
    selectedFields: state.settings.selectedFields
  }
}

export default connect(mapStateToProps, {...actions, ...jetActions})(Group)
