import { Peer, Fetcher } from 'node-jet'

let peers = {}
let pendings = {}
let fetcher

const ensurePeer = ({url, user, password}) => {
  return new Promise((resolve, reject) => {
    const id = [url, user, password].join('--')
    if (!peers[id]) {
      pendings[id] = []
      const peer = new Peer({url, user, password})
      peers[id] = peer

      peer.connect()
        .then(() => {
          pendings[id].forEach((pending) => {
            pending.resolve(peer)
          })
          delete pendings[id]
        })
        .catch((err) => {
          pendings[id].forEach((pending) => {
            pending.reject(err)
          })
          delete pendings[id]
        })

      peer.closed().then(() => {
        delete pendings[id]
        delete peers[id]
      })
    }

    if (pendings[id]) {
      pendings[id].push({resolve, reject})
    } else {
      resolve(peers[id])
    }
  })
}

export const connect = (connection) => {
  return ensurePeer(connection)
}

export const close = (connection) => {
  const {url, user, password} = connection
  const id = [url, user, password].join('--')
  if (peers[id]) {
    peers[id].close()
  }
}

export const fetch = (connection, fetchExpression, onStatesDidChange) => {
  return ensurePeer(connection)
    .then((peer) => {
      if (fetcher) {
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
    })
}

export const set = (connection, path, value) => {
  return ensurePeer(connection)
    .then((peer) => {
      return peer.set(path, value)
    })
}

export const call = (connection, path, args) => {
  return ensurePeer(connection)
    .then((peer) => {
      return peer.call(path, args)
    })
}
