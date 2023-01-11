import { solstice, julian, planetposition } from 'astronomia'
import { vsop87Bearth } from './vsop87Bearth.js'
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import CalDate from 'caldate'
import CalEvent from './CalEvent.js'

const earth = new planetposition.Planet(vsop87Bearth)

export default class Equinox extends CalEvent {
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
    const date = utcToZonedTime(str, this._timezone)

    const floorDate = {
      year,
      month: date.getMonth() + 1,
      day: date.getDate()
    }

    const d = new CalDate(floorDate).setOffset(this.offset)
    this.dates.push(d)
    return this
  }
}
