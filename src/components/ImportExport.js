/* globals FileReader */
import React from 'react'
import {connect} from 'react-redux'
import {setFavorites, setFavoritesFailed} from '../actions'

const ImportExport = ({favoritesDataUri, setFavorites, setFavoritesFailed}) => {
  const loadFavorites = (event) => {
    const file = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.onload = data => {
      try {
        const favorites = JSON.parse(data.target.result)
        setFavorites(favorites)
      } catch (err) {
        setFavoritesFailed('no JSON')
      }
    }
    fileReader.readAsText(file)
  }
  const openFileDialog = (event) => {
    event.target.previousElementSibling.click()
    event.preventDefault()
  }
  return (
    <div className='ImportExport'>
      <h1>Favorites</h1>
      <a className='Button' href={favoritesDataUri} download='favorites.json' >Export</a>
      <input type='file' style={{display: 'none'}} onChange={loadFavorites} accept='.json' />
      <a className='Button' href='#' onClick={openFileDialog} >Import</a>
    </div>
  )
}

const dataUri = json => (
  `text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`
)

const mapStateToProps = state => ({
  favoritesDataUri: `data:${dataUri(state.settings.favorites)}`
})

const actions = {
  setFavorites,
  setFavoritesFailed
}

export default connect(mapStateToProps, actions)(ImportExport)
