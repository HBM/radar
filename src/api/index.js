import { Peer, Fetcher } from 'node-jet'

let peer
let fetcher

export const connect = (url, user, password) => {
  if (peer) {
    peer.close()
  }
  peer = new Peer({url, user, password})
  return peer.connect()
}

export const changeFetcher = (fetchExpression, onStatesDidChange) => {
  if (fetcher) {
    fetcher.unfetch()
  }
  fetcher = new Fetcher()
  if (fetchExpression && fetchExpression.trim() !== '') {
    fetcher
      .path('contains', fetchExpression.trim())
      .pathCaseInsensitive()
  }
  fetcher
    .sortByPath()
    .range(1, 100)
  fetcher.on('data', onStatesDidChange)
  return peer.fetch(fetcher)
}
