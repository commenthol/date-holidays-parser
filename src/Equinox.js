'use strict'

const solstice = require('astronomia/lib/solstice')
const julian = require('astronomia/lib/julian')
const planetpos = require('astronomia/lib/planetposition')
const earth = new planetpos.Planet(require('astronomia/data/vsop87Bearth'))

const {toTimezone} = require('./internal/utils')
const CalEvent = require('./CalEvent')

const addDays = require('date-fns/add_days')
const startOfDay = require('date-fns/start_of_day')

class Equinox extends CalEvent {
  /**
   * @param {object} [opts]
   * @param {string} opts.season - type of season (spring|summer|autumn|winter)
   * @param {number|string} opts.offset - offset in days
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)

    this._season = opts.season
    this._timezone = opts.timezone || 'GMT'
  }

  inYear (year) {
    let jde
    switch (this._season) {
      case 'march': {
        jde = solstice.march2(year, earth)
        break
      }
      case 'june': {
        jde = solstice.june2(year, earth)
        break
      }
      case 'september': {
        jde = solstice.september2(year, earth)
        break
      }
      case 'december': {
        jde = solstice.december2(year, earth)
        break
      }
    }

    const str = new julian.Calendar().fromJDE(jde).toDate().toISOString()
    const date = toTimezone(new Date(str), this._timezone) // move to timezone

    const d = addDays(startOfDay(date), this.offset)
    this.dates.push(d)
    return this
  }
}
module.exports = Equinox
