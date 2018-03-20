'use strict'

const CalChinese = require('date-chinese')
const CalEvent = require('./CalEvent')
const addDays = require('date-fns/add_days')

class Chinese extends CalEvent {
  /**
   * @param {object} [opts]
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)
    switch (opts.fn) {
      case 'chinese':
        this.cal = new CalChinese.CalendarChinese()
        break
      case 'korean':
        this.cal = new CalChinese.CalendarKorean()
        break
      case 'vietnamese':
        this.cal = new CalChinese.CalendarVietnamese()
        break
    }
  }

  inYear (year) {
    let d
    let jde
    let date
    let opts = this.opts
    if (opts.solarterm) {
      jde = this.cal.solarTerm(opts.solarterm, year)
      date = this.cal.fromJDE(jde).toGregorian()
      d = addDays(new Date(date.year, date.month - 1, date.day), opts.day - 1)
    } else {
      this.cal.set(opts.cycle, opts.year, opts.month, opts.leapMonth, opts.day)
      jde = this.cal.toJDE(year)
      date = this.cal.fromJDE(jde).toGregorian()
      d = new Date(date.year, date.month - 1, date.day)
    }

    this.dates.push(d)
    return this
  }
}
module.exports = Chinese
