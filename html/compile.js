var fs = require('fs')
var Handlebars = require('handlebars')

var development = process.env.NODE_ENV === 'development'

var source = fs.readFileSync('./html/index.hbs', 'utf8')
var template = Handlebars.compile(source)
var context = {
  development: development
}
var result = template(context)

if (development) {
  fs.writeFileSync('./debug/index.html', result)
} else {
  fs.writeFileSync('./prod/index.html', result)
}
