import CalBengali from 'date-bengali-revised'
import CalDate from 'caldate'
import CalEvent from './CalEvent.js'

export default class BengaliRevised extends CalEvent {
  /**
   * @param {object} [opts]
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)
  }

  inYear (year) {
    const opts = this.opts
    const date = new CalBengali(year - 593, opts.month, opts.day).toGregorian()
    const d = new CalDate(date)
    this.dates.push(d)
    return this
  }
}
