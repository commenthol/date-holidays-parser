import {
  CalendarChinese,
  CalendarKorean,
  CalendarVietnamese
} from 'date-chinese'
import CalEvent from './CalEvent.js'
import CalDate from 'caldate'

export default class Chinese extends CalEvent {
  /**
   * @param {object} [opts]
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)
    switch (opts.fn) {
      case 'chinese':
        this.cal = new CalendarChinese()
        break
      case 'korean':
        this.cal = new CalendarKorean()
        break
      case 'vietnamese':
        this.cal = new CalendarVietnamese()
        break
    }
  }

  inYear (year) {
    let d
    let jde
    let date
    const opts = this.opts
    if (opts.solarterm) {
      jde = this.cal.solarTerm(opts.solarterm, year)
      date = this.cal.fromJDE(jde).toGregorian()
      d = new CalDate(date).setOffset(opts.day - 1)
    } else {
      this.cal.set(opts.cycle, opts.year, opts.month, opts.leapMonth, opts.day)
      jde = this.cal.toJDE(year)
      date = this.cal.fromJDE(jde).toGregorian()
      d = new CalDate(date)
    }

    this.dates.push(d)
    return this
  }
}
