'use strict'

const CalEvent = require('./CalEvent')
const addDays = require('date-fns/add_days')

/**
 * Mapper class for mapped calenders like hijri and hebrew
 * `this.calender` needs to be set in child classes
 */
class CalEventMap extends CalEvent {
  constructor (opts) {
    super(opts)
    this.calendar = {}
  }

  inYear (year) {
    if (!(this.calendar[year] && this.calendar[year + 1] && this.calendar[year - 1])) {
      return this
    }

    for (let y = year - 1; y <= year + 1; y++) {
      // resolve date in `calendar` as gregorian date
      let firstDays = this.calendar[y][this.opts.month - 1]
      // firstDays `[M, D, diffYear]`
      for (let i = 0; i < firstDays.length; i += 3) {
        if (this.opts.year) {
          let calYear = this.calendar.year + firstDays[i + 2]
          if (this.opts.year !== calYear) {
            break
          }
        }
        const d = addDays(
          new Date(y, firstDays[i], (firstDays[i + 1])),
          this.opts.day - 1
        )

        if (d.getFullYear() === year) {
          this.dates.push(d)
        }
      }
    }
    return this
  }
}
module.exports = CalEventMap
