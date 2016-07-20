var flatten = require('flat')

var flatObject = function (value) {
  if (typeof value === 'object') {
    return flatten(value)
  } else {
    var fv = {}
    fv[''] = value
    return fv
  }
}

module.exports = flatObject
