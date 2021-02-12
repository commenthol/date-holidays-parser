'use strict'

import { isDate } from './internal/utils.js'
import CalDate from 'caldate'

export default class CalEvent {
  constructor (opts) {
    opts = opts || {}
    this.substitute = opts.substitute
    this.opts = opts
    this.offset = opts.offset
    this.dates = []
    this.active = undefined // active props from prior to rule
    if (isDate(opts)) {
      this.opts = new CalDate(opts)
    }
  }

  inYear (year) {
    const d = (new CalDate(this.opts)).setOffset(this.offset)
    if (!(d.year && d.year !== year)) {
      d.year = year
      this.dates.push(d)
    }
    return this
  }

  reset () {
    this.dates = []
  }

  isEqualDate (calEvent) {
    let res = false
    for (const thisDate of this.dates) {
      for (const date of calEvent.dates) {
        res |= thisDate.isEqualDate(date)
      }
    }
    return !!res
  }

  /**
   * @param {Number} year - year to filter
   * @param {Object[]} active - definition of active ranges `{from: {Date}, [to]: {Date}}`
   * @return {this} for chaining
   */
  filter (year, active = this.active) {
    this.dates = this.dates.filter((date) => {
      if (!date._filter && isActive(date, year, active)) {
        return date
      }
    })

    return this
  }

  setActive (active) {
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
  }

  push (calEvent) {
    if (calEvent && Array.isArray(calEvent.dates)) {
      this.dates = this.dates.concat(calEvent.dates)
    }
  }

  get (timezone) {
    const arr = this.dates.map((date) => {
      const o = {
        date: date.toString(),
        start: date.toTimezone(timezone),
        end: date.toEndDate().toTimezone(timezone)
      }
      this._addSubstitute(date, o)
      return o
    })
    return arr
  }

  _addSubstitute (date, obj) {
    if (this.substitute || date.substitute) obj.substitute = true
  }
}

function isActive (date, year, active) {
  if (!active) {
    if (date.year === year) {
      return true
    } else {
      return false
    }
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
