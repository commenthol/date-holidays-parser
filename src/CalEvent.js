import { isDate } from './internal/utils.js'
import CalDate from 'caldate'

/** @typedef {import('./types.js').EventOptions} EventOptions */
/** @typedef {import('./types.js').ActiveRange} ActiveRange */
/** @typedef {import('./types.js').RuleDate} RuleDate */

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
    /** @type {RuleDate[]} */
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
   * @param {import('caldate').TimezoneAdapter} [timezoneAdapter]
   * @returns
   */
  get(timezone, timezoneAdapter) {
    const arr = this.dates.map((date) => {
      const cdate = new CalDate(date)
      const offsetMinutes = date._calendarOffsetMinutes
      const start = new CalDate(cdate)
      if (offsetMinutes !== undefined) {
        start.setOffset(offsetMinutes, 'm')
      }
      /** @type {import('caldate').default} */
      let end
      if (date._calendarDuration !== undefined) {
        end = new CalDate(start).setDuration(date._calendarDuration).toEndDate()
      } else if (offsetMinutes !== undefined) {
        end = new CalDate(start).setOffset(1, 'd')
      } else {
        end = cdate.toEndDate()
      }
      const o = {
        date:
          cdate.toString() +
          (offsetMinutes === undefined
            ? ''
            : ` ${formatOffsetMinutes(offsetMinutes)}`),
        start: start.toTimezone(timezone, timezoneAdapter),
        end: end.toTimezone(timezone, timezoneAdapter)
      }
      this._addSubstitute(date, o)
      return o
    })
    return arr
  }

  /** @param {RuleDate} date @param {{ date: string, start: Date, end: Date, substitute?: boolean }} obj */
  _addSubstitute(date, obj) {
    if (this.substitute || date.substitute) obj.substitute = true
  }
}

/** @param {number} offsetMinutes */
function formatOffsetMinutes(offsetMinutes) {
  const sign = offsetMinutes < 0 ? '-' : '+'
  const absolute = Math.abs(offsetMinutes)
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const minutes = String(absolute % 60).padStart(2, '0')
  return `${sign}${hours}${minutes}`
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
