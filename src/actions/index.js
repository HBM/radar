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

export const setSearch = (search) => ({
  type: 'SEARCH_SET',
  search
})
