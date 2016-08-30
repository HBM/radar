import { Peer, Fetcher } from 'node-jet'

let peers = {}
let pendings = {}
let fetchers = {}

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

export const unfetch = (connection, id) => {
  const {url, user, password} = connection
  const fid = [url, user, password, id].join('--')
  let fetcher = fetchers[fid]
  if (fetcher) {
    fetcher.unfetch()
  }
  delete fetchers[fid]
}

export const fetch = (connection, fetchExpression, id, onStatesDidChange) => {
  return ensurePeer(connection)
    .then((peer) => {
      const {url, user, password} = connection
      const fid = [url, user, password, id].join('--')
      let fetcher = fetchers[fid]
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
      fetchers[fid] = fetcher
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
