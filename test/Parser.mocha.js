/* global describe, it */

const path = require('path')
const assert = require('assert')
const Parser = require('../src/Parser')
const serializeToModule = require('serialize-to-js').serializeToModule

const exp = require('./fixtures/parser.js')

const p = new Parser()
const parser = p.parse.bind(p)

if (~process.argv.indexOf('--writetests')) {
  (function () {
    const store = {}
    const filename = path.resolve(__dirname, 'fixtures', 'parser.js')
    for (const name in exp) {
      const res = parser(name)
      store[name] = res
    }
    const js = serializeToModule(store, { beautify: true, comment: 'eslint-disable' })
    require('fs').writeFileSync(filename, js, 'utf8')
    console.log(filename, 'written') // eslint-disable-line
  })()
}

function test (name) {
  it(name, function () {
    const res = parser(name)
    assert.deepStrictEqual(res, exp[name])
  })
}

describe('#parser', function () {
  for (const name in exp) {
    test(name)
  }
})
