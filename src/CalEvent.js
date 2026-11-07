import { isDate } from './internal/utils.js'
import CalDate from 'caldate'

/** @typedef {import('./types.js').EventOptions} EventOptions */
/** @typedef {import('./types.js').ActiveRange} ActiveRange */

export default class CalEvent {
  /**
   * @param {EventOptions|Date} [opts={}] event options or a date
   */
  constructor(opts = {}) {
    if (isDate(opts)) {
      this.substitute = undefined
      /** @type {EventOptions} */
      this.opts = new CalDate(opts)
      this.offset = undefined
    } else {
      this.substitute = opts.substitute
      this.opts = opts
      this.offset = opts.offset
    }
    /** @type {import('caldate').default[]} */
    this.dates = []
    /** @type {ActiveRange[]|undefined} */
    this.active = undefined // active props from prior to rule
  }

  /**
   * @param {number} year
   * @returns {this}
   */
  inYear(year) {
    const d = new CalDate(this.opts).setOffset(this.offset)
    if (!(d.year && d.year !== year)) {
      d.year = year
      this.dates.push(d)
    }
    return this
  }

  reset() {
    this.dates = []
  }

  /**
   * @param {CalEvent} calEvent
   * @returns {boolean}
   */
  isEqualDate(calEvent) {
    let res = false
    for (const thisDate of this.dates) {
      for (const date of calEvent.dates) {
        res = res || thisDate.isEqualDate(date)
      }
    }
    return !!res
  }

  /**
   * Filter out disabled dates
   * @param {number} year
   * @param {number} month
   * @returns {this}
   */
  filterDisabled(year, month) {
    if (!year) {
      return this
    }

    this.dates = this.dates.filter((date) => {
      const disable = month
        ? date.year === year && date.month === month
        : date.year === year
      return !disable
    })

    return this
  }

  /**
   * @param {number} year - year to filter
   * @param {ActiveRange[]} [active=this.active] - active date ranges
   * @return {this} for chaining
   */
  filterActive(year, active = this.active) {
    this.dates = this.dates.filter((date) => {
      if (!date._filter && isActive(date, year, active)) {
        return date
      }
    })

    return this
  }

  /**
   * @param {ActiveRange} active
   * @returns {this}
   */
  setActive(active) {
    const { from, to } = active
    let pushIt = true
    this.active = this.active || []
    if (to && !from) {
      const last = this.active[this.active.length - 1]
      if (last && last.from && !last.to) {
        last.to = to
        pushIt = false
      }
    }
    if (pushIt) {
      this.active.push(active)
    }

    return this
  }

  /**
   * @param {CalEvent} calEvent
   */
  push(calEvent) {
    if (calEvent && Array.isArray(calEvent.dates)) {
      this.dates = this.dates.concat(calEvent.dates)
    }
  }

  /**
   * @param {string} timezone
   * @returns
   */
  get(timezone) {
    const arr = this.dates.map((date) => {
      const cdate = new CalDate(date)
      const o = {
        date: cdate.toString(),
        start: cdate.toTimezone(timezone),
        end: cdate.toEndDate().toTimezone(timezone)
      }
      this._addSubstitute(date, o)
      return o
    })
    return arr
  }

  _addSubstitute(date, obj) {
    if (this.substitute || date.substitute) obj.substitute = true
  }
}

/**
 * @param {import('caldate').default} date
 * @param {number} year
 * @param {ActiveRange[]} [active]
 * @returns {boolean|undefined}
 */
function isActive(date, year, active) {
  if (!active) {
    return date.year === year
  }
  const _date = date.toDate()
  for (const a of active) {
    const { from, to } = a
    if (
      date.year === year &&
      ((from && to && from <= _date && to > _date) ||
        (from && !to && from <= _date) ||
        (!from && to && to > _date))
    ) {
      return true
    }
  }
}
