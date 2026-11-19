const { default: Holidays } = require('../lib/index.cjs')
const { plugins } = require('date-holidays-parser/plugins')
const {
  EasterCalendarPlugin
} = require('date-holidays-parser/plugins/EasterCalendarPlugin')
const assert = require('assert')
const fixtures = require('./fixtures/index.cjs')

describe('#issue-cjs', function () {
  it('shall require cjs and the built-in plugin bundle', function () {
    assert.ok(plugins.includes(EasterCalendarPlugin))
    const hd = new Holidays(fixtures.holidays, { plugins })
    hd.init('JP')
    const holidays = hd.getHolidays()
    assert.ok(holidays.length > 10)
  })
})
