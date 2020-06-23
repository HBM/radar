import React, { useRef, useState, useEffect } from 'react'
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
import { Route, withRouter } from 'react-router-dom'

const Group = (props) => {
  const lastGroup = useRef()
  const fetching = useRef(false)
  const [searchTerms, setSearchTerms] = useState([])
  const [searchTermsChips, setSearchTermsChips] = useState([])

  const updateFetch = (groups, nextGroup) => {
    let group = {...groups.find(group => group.title === nextGroup)}
    if (!group || !group.expression) {
      return
    }
    if (!fetching.current || lastGroup.current !== nextGroup) {
      lastGroup.current = nextGroup
      props.unfetch(props.connection, 'group')
      props.fetch(props.connection, group.expression, 'group')
      fetching.current = true
    }
  }

  useEffect(() => {
    updateFetch(props.groups, decodeURIComponent(props.match.params.group))
    return () => {
      props.unfetch(this.props.connection, 'group')
      fetching.current = false
    }
  }, [props.groups])

  const onChange = (terms) => {
    setSearchTermsChips(terms)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    props.setSelectedFields([])
    setSearchTerms(setSearchTermsChips)
  }

  const {statesAndMethods, toggleFavorite, favorites, selectedFields, match} = props

  const filteredStatesAndMethods = getFilteredStatesAndMethods(statesAndMethods, searchTerms || [])

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
          onChange={onChange}
          onSubmit={onSubmit}
          terms={searchTermsChips}
          statesAndMethods={filteredStatesAndMethods}
          selectedFields={selectedFields}
        />
        <StateAndMethodList statesAndMethods={filteredStatesAndMethods} iconCreator={createStar} rootPath={'/groups/' + encodeURIComponent(match.params.group)} selectedFields={selectedFields} />
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

const mapStateToProps = (state) => {
  return {
    groups: state.data.groups ? state.data.groups.value : [],
    favorites: state.settings.favorites,
    statesAndMethods: state.data.group,
    connection: state.settings.connection,
    selectedFields: state.settings.selectedFields
  }
}

export default withRouter(connect(mapStateToProps, {...actions, ...jetActions})(Group))
