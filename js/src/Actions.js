var Dispatcher = require('./Dispatcher')

var Actions = {
  connectionStatus: function (status) {
    Dispatcher.dispatch({
      type: 'connectionStatus',
      status: status
    })
  },

  listChanged: function (changes, n) {
    Dispatcher.dispatch({
      type: 'listChanged',
      changes: changes,
      n: n
    })
  },

  gotCallResponse: function (path, err, result) {
    Dispatcher.dispatch({
      type: 'gotCallResponse',
      path: path,
      error: err,
      result: result
    })
  },

  gotSetResponse: function (path, err) {
    Dispatcher.dispatch({
      type: 'gotSetResponse',
      path: path,
      error: err
    })
  }

}

module.exports = Actions
