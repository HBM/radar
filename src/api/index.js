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
  if (peer && !peer.closed() && fetcher) {
    fetcher.unfetch()
  }
  fetcher = new Fetcher()
    .pathCaseInsensitive()
    .sortByPath()
    .range(1, 100)
    .on('data', onStatesDidChange)
  if (fetchExpression.containsAllOf) {
    fetcher.path('containsAllOf', fetchExpression.containsAllOf)
  } else if (fetchExpression.equalsOneOf) {
    fetcher.path('equalsOneOf', fetchExpression.equalsOneOf)
  }
  return peer.fetch(fetcher)
}

export const setState = (path, value) => {
  return peer.set(path, value)
}

export const callMethod = (path, args) => {
  return peer.call(path, args)
}
