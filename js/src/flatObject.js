var flatten = require('flat')

var flatObject = function (value) {
  if (typeof value === 'object') {
    var fv = flatten(value)
    return fv
  } else {
    var fv = {}
    fv[''] = value
    return fv
  }
}

module.exports = flatObject
