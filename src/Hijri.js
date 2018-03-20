'use strict'

const CalEventMap = require('./CalEventMap')
const calendar = require('./internal/hijri-calendar')
const {toTimezone} = require('./internal/utils')
const format = require('date-fns/format')
const addDays = require('date-fns/add_days')
const addHours = require('date-fns/add_hours')

class Hijri extends CalEventMap {
  constructor (opts) {
    super(opts)
    this.calendar = calendar
  }

  get (timezone) {
    const arr = this.dates.map((date) => {
      const _date = addHours(date, -6)
      const o = {
        date: format(date, 'YYYY-MM-DD HH:mm:ss -0600'),
        start: toTimezone(_date, timezone),
        end: toTimezone(addDays(_date, 1), timezone)
      }
      this._addSubstitute(date, o)
      return o
    })
    return arr
  }
}
module.exports = Hijri
