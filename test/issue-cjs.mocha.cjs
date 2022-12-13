const { default: Holidays } = require('../lib/index.cjs')
const assert = require('assert')
const fixtures = require('./fixtures/index.cjs')

describe('#issue-cjs', function () {
  it('shall require cjs', function () {
    const hd = new Holidays(fixtures.holidays)
    hd.init('JP')
    const holidays = hd.getHolidays()
    assert.ok(holidays.length > 10)
  })
})
