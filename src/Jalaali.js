import CalDate from 'caldate'
import CalEvent from './CalEvent.js'
import { toJalaali, toGregorian } from 'jalaali-js'

export default class Jalaali extends CalEvent {
  /**
   * @param {number} year gregorian year
   * @returns
   */
  inYear(year) {
    const nowruz = toJalaali(year, 1, 1)

    if (this.opts.year && nowruz.jy !== this.opts.year) {
      return this
    }
    const { gy, gm, gd } = toGregorian(
      this.opts.year || nowruz.jy,
      this.opts.month,
      this.opts.day
    )

    const d = new CalDate({ year: gy, month: gm, day: gd }).setOffset(
      this.offset
    )
    this.dates.push(d)
    return this
  }
}
