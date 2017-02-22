require('babel-register')({
  ignore: /node_modules\/(?!md-components)/,
  presets: ['es2015', 'es2017', 'react', 'stage-0'],
  plugins: ['transform-runtime']
})

var jsdom = require('jsdom').jsdom

global.document = jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

global.React = require('react')
