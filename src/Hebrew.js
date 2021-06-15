import CalDate from 'caldate'
import CalEventMap from './CalEventMap.js'
import { calendar } from './internal/hebrew-calendar.js'

export default class Hebrew extends CalEventMap {
  constructor (opts) {
    super(opts)
    this.calendar = calendar
  }

  get (timezone) {
    const arr = this.dates.map((date) => {
      const cdate = new CalDate(date)
      const o = {
        date: cdate.toString() + ' -0600',
        start: cdate.setOffset(-6, 'h').toTimezone(timezone),
        end: cdate.toEndDate().toTimezone(timezone)
      }
      this._addSubstitute(date, o)
      return o
    })
    return arr
  }
}
