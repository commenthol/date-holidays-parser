'use strict'

const {isDate, toTimezone} = require('./internal/utils')
const addDays = require('date-fns/add_days')
const addHours = require('date-fns/add_hours')
const compareAsc = require('date-fns/compare_asc')
const format = require('date-fns/format')
const isSameDay = require('date-fns/is_same_day')
const setYear = require('date-fns/set_year')
const startOfDay = require('date-fns/start_of_day')

class CalEvent {
  constructor (opts) {
    opts = opts || {}
    this.substitute = opts.substitute
    this.opts = opts
    this.offset = opts.offset || 0
    this.dates = []
    if (isDate(opts)) {
      this.opts = new Date(opts)
    }
  }

  inYear (year) {
    let d
    if (this.opts instanceof Date) {
      d = toTimezone(this.opts)
    } else {
      d = new Date(this.opts.year || year, this.opts.month - 1, this.opts.day)
    }

    if (!(d.getFullYear() && d.getFullYear() !== year)) {
      d = setYear(d, year)
      this.dates.push(addDays(d, this.offset))
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
        res |= isSameDay(thisDate, date)
      }
    }
    return !!res
  }

  /**
   * @param {Number} year - year to filter
   * @param {Object[]} active - definition of active ranges `{from: {Date}, [to]: {Date}}`
   * @return {this} for chaining
   */
  filter (year, active) {
    function isActive (date) {
      if (!active) {
        if (date.getFullYear() === year) {
          return true
        } else {
          return false
        }
      }

      for (let a of active) {
        const {from, to} = a
        const fromBeforeOrEqualToDate = (compareAsc(from, date) !== 1)
        const toAfterDate = (compareAsc(to, date) === 1)
        if (
          date.getFullYear() === year &&
          ((from && to && fromBeforeOrEqualToDate && toAfterDate) ||
          (from && !to && fromBeforeOrEqualToDate) ||
          (!from && to && toAfterDate))
        ) {
          return true
        }
      }
    }

    this.dates = this.dates.filter((date) => {
      if (!date._filter && isActive(date)) {
        return date
      }
    })

    return this
  }

  push (calEvent) {
    if (calEvent && Array.isArray(calEvent.dates)) {
      this.dates = this.dates.concat(calEvent.dates)
    }
  }

  get (timezone) {
    const arr = this.dates.map((date) => {
      let endDate
      if (date.duration) {
        endDate = addHours(date, date.duration)
      } else {
        endDate = startOfDay(addDays(date, 1))
      }

      const o = {
        date: format(date, 'YYYY-MM-DD HH:mm:ss'),
        start: toTimezone(date, timezone),
        end: toTimezone(endDate, timezone)
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
module.exports = CalEvent
