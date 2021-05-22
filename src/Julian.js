import { julian } from 'astronomia'
import CalDate from 'caldate'
import CalEvent from './CalEvent.js'

export default class Julian extends CalEvent {
  inYear (year) {
    if (this.opts.year && this.opts.year !== year) {
      return this
    }
    const cal = new julian.CalendarJulian(year, this.opts.month, this.opts.day).toGregorian()
    const d = (new CalDate(cal)).setOffset(this.offset)
    this.dates.push(d)
    return this
  }
}
