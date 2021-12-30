import CalEvent from './CalEvent.js'
import CalDate from 'caldate'

/**
 * Mapper class for mapped calenders like hijri and hebrew
 * `this.calender` needs to be set in child classes
 */
export default class CalEventMap extends CalEvent {
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
      const firstDays = this.calendar[y][this.opts.month - 1]
      // firstDays `[M, D, diffYear, ...] | null`
      if (!firstDays) {
        continue
      }
      for (let i = 0; i < firstDays.length; i += 3) {
        if (this.opts.year) {
          const calYear = this.calendar.year + firstDays[i + 2]
          if (this.opts.year !== calYear) {
            continue
          }
        }
        const d = (new CalDate({
          year: y,
          month: firstDays[i] + 1,
          day: firstDays[i + 1]
        })).setOffset(this.opts.day - 1)

        if (d.year === year) {
          this.dates.push(d)
        }
      }
    }
    return this
  }
}
