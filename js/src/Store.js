var jet = require('node-jet')
var Dispatcher = require('./Dispatcher')
var EventEmitter = require('events').EventEmitter
var assign = require('object-assign')

var connectionStatus = 'disconnected'
var list = []

var Store = assign({}, EventEmitter.prototype, {
  getConnectionStatus: function () {
    return connectionStatus
  },

  getList: function () {
    return list
  },

  addChangeListener: function (callback) {
    this.on('change', callback)
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback)
  },

  emitChange: function () {
    this.emit('change')
  }

})

var findItem = function (path) {
  var match = list.filter(x => x.path === path)
  return match[0]
}

var counts = {}

var updateList = function (changes, n) {
  var from = 1
  list.length = n
  var now = new Date()
  changes.forEach(function (change) {
    var listIndex = change.index - from
    var prevCount = counts[change.path] || 0
    change.count = ++prevCount
    change.lastChange = now
    counts[change.path] = change.count
    list[listIndex] = change
  })
}

Dispatcher.register(function (action) {
  switch (action.type) {
    case 'connectionStatus':
      connectionStatus = action.status
      if (connectionStatus !== 'connected') {
        list = []
        counts = {}
      }
      break
    case 'listChanged':
      updateList(action.changes, action.n)
      break
    case 'gotCallResponse':
      var item = findItem(action.path)
      item.callResponse = {
        error: action.error,
        result: action.result
      }
    case 'gotSetResponse':
      var item = findItem(action.path)
      item.setResponse = {
        error: action.error
      }
    default:
  }
  Store.emitChange()
})

module.exports = Store
