/* global describe, before, after, it */

const assert = require('assert')
const webdriver = require('selenium-webdriver')
const By = webdriver.By
const express = require('express')
const path = require('path')

describe('Radar selenium', function () {
  this.timeout(5000)
  var driver
  var server

  before((done) => {
    var app = express()
    app.use('/', express.static(path.join(__dirname, '../')))
    driver = new webdriver.Builder()
      .forBrowser('firefox')
      .build()
    server = app.listen(8080, () => {
      driver.get('http://localhost:8080')
      setTimeout(done, 3000)
    })
  })

  after(() => {
    server.close()
    driver.quit()
  })

  it('loads the app', (done) => {
    driver
      .findElement(By.css('#app'))
      .then((element) => {
        assert(element)
        done()
      })
    .catch(done)
  })
})
