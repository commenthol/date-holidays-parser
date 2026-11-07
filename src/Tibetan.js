import {
  CalendarTibetan,
  CalendarMongolian,
  CalendarBhutanese
} from '@hnw/date-tibetan'
import CalEvent from './CalEvent.js'
import CalDate from 'caldate'

/** @typedef {import('./types.js').EventOptions} EventOptions */

export default class Tibetan extends CalEvent {
  /**
   * @param {EventOptions} [opts]
   */
  constructor(opts) {
    opts = opts || {}
    super(opts)
    switch (opts.fn) {
      case 'tibetan':
        this.cal = new CalendarTibetan()
        break
      case 'mongolian':
        this.cal = new CalendarMongolian()
        break
      case 'bhutanese':
        this.cal = new CalendarBhutanese()
        break
    }
  }

  inYear(year) {
    const opts = this.opts
    this.cal.set(
      opts.cycle,
      opts.year,
      opts.month,
      opts.leapMonth,
      opts.day,
      opts.leapDay
    )
    const date = this.cal.toGregorian(year)
    const d = new CalDate(date)
    this.dates.push(d)
    return this
  }
}
