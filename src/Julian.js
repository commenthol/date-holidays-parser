'use strict'

const julian = require('astronomia/lib/julian')
const CalEvent = require('./CalEvent')
const addDays = require('date-fns/add_days')

class Julian extends CalEvent {
  inYear (year) {
    if (this.opts.year && this.opts.year !== year) {
      return this
    }
    const cal = new julian.CalendarJulian(year, this.opts.month, this.opts.day).toGregorian()
    const d = addDays(new Date(cal.year, cal.month - 1, cal.day), this.offset)
    this.dates.push(d)
    return this
  }
}
module.exports = Julian
