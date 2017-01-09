export const addFavorite = (path) => ({
  type: 'FAVORITE_ADD',
  path
})

export const removeFavorite = (path) => ({
  type: 'FAVORITE_REMOVE',
  path
})

export const toggleFavorite = (path) => ({
  type: 'FAVORITE_TOGGLE',
  path
})

export const addConnection = () => ({
  type: 'CONNECTION_ADD'
})

export const removeConnection = (index) => ({
  type: 'CONNECTION_REMOVE',
  index
})

export const changeConnection = (index, connection) => ({
  type: 'CONNECTION_CHANGE',
  index,
  connection
})

export const selectConnection = (index) => ({
  type: 'CONNECTION_SELECT',
  index
})

export const setSearch = (search) => ({
  type: 'SEARCH_SET',
  search
})

export const setSelectedFields = (fields) => ({
  type: 'SELECTED_FIELDS_SET',
  fields
})

export const setFavorites = (favorites) => ({
  type: 'FAVORITE_SET',
  favorites
})

export const setFavoritesFailed = (reason) => ({
  type: 'FAVORITE_FAILURE',
  reason
})
