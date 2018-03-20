'use strict'

const easter = require('date-easter')
const CalEvent = require('./CalEvent')
const addDays = require('date-fns/add_days')
const addMinutes = require('date-fns/add_minutes')

class Easter extends CalEvent {
  /**
   * @param {object} [opts]
   * @param {string} opts.type - type of eastern (easter|orthodox)
   * @param {number|string} opts.offset - offset in days
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)

    this._fn = easter.easter
    if (opts.type === 'orthodox') {
      this._fn = easter.orthodoxEaster
    }
  }

  inYear (year) {
    let d = addDays(new Date(this._fn(year)), this.offset)
    d = addMinutes(d, new Date().getTimezoneOffset())
    this.dates.push(d)
    return this
  }
}
module.exports = Easter
