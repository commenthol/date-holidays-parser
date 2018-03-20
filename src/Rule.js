/**
 * handle rule per event
 */

'use strict'

const DAYS = require('./internal/utils').DAYS
const addDays = require('date-fns/add_days')
const setHours = require('date-fns/set_hours')
const setMinutes = require('date-fns/set_minutes')

class Rule {
  /**
  * @param {CalEvent} [calEvent]
   * @param {array} [holidays]
   */
  constructor (calEvent) {
    this.calEvent = calEvent
  }

  /**
   * @param {CalEvent} calEvent
   */
  setEvent (calEvent) {
    this.calEvent = calEvent
    return this
  }

  /**
   * @return {CalEvent}
   */
  getEvent () {
    return this.calEvent
  }

  /**
   * @param {string} modifier
   */
  setModifier (modifier) {
    this.modifier = modifier
  }

  /**
   * resolves rule to function
   * @param {object} rule
   */
  resolve (rule) {
    if (rule.rule &&
      typeof this[rule.rule] === 'function'
    ) {
      this[rule.rule](rule)
    } else if (rule.modifier) {
      this.modifier = rule.modifier
    }
    return this
  }

  /**
   * @param {CalEvent} [calEvent]
   * @param {object} rule
   * {
   *   rule: "dateDir",
   *   count: 1,
   *   weekday: "tuesday",
   *   direction: "after"
   * }
   */
  dateDir (rule) {
    this.calEvent.dates.forEach((date, i) => {
      let offset
      let count = rule.count - 1
      const weekday = date.getDay()
      const ruleWeekday = DAYS[rule.weekday]

      if (rule.weekday === 'day') {
        if (rule.direction === 'before') {
          offset = (count + 1) * -1
        } else {
          offset = count + 1
        }
      } else {
        if (rule.direction === 'before') {
          if (weekday === ruleWeekday) {
            count++
          }
          offset = ((7 + weekday - ruleWeekday) % 7 + count * 7) * -1
        } else {
          offset = ((7 - weekday + ruleWeekday) % 7 + count * 7)
        }
      }
      if (offset) {
        this.calEvent.dates[i] = addDays(date, offset)
      }
    })
  }

  /**
   * @param {object} rule
   * {
   *   rule: "dateIfThen",
   *   if: ["sunday"],
   *   direction: "next",
   *   then: "sunday"
   * }
   */
  dateIfThen (rule) {
    const dates = []

    this.calEvent.dates = this.calEvent.dates.map((date) => {
      let substitute = false
      let _filter, _lock, duration

      if (date._lock) {
        return date
      }
      const weekday = date.getDay()
      if (~(rule.if).indexOf(DAYS[weekday])) {
        if (this.modifier === 'and') {
          dates.push(new Date(date))
          substitute = true
        }
        _filter = false
        let offset = 0
        let then = DAYS[rule.then]
        if (rule.then && then !== 'undefined') {
          if (rule.direction === 'previous') {
            offset = -1 * ((7 + weekday - then) % 7)
            if (!offset) {
              offset = -7
            }
          } else {
            offset = ((7 - weekday + then) % 7)
            if (!offset) {
              offset = 7
            }
          }
          date = addDays(date, offset)
          _lock = true
          if (this.modifier === 'substitutes') substitute = true
        }
        (rule.rules || []).forEach((rule) => {
          switch (rule.rule) {
            case 'time':
              date = setHours(setMinutes(date, rule.minute), rule.hour)
              break
            case 'duration':
              duration = rule.duration
              break
          }
        })
      } else if (this.modifier === 'substitutes') {
        _filter = true
      }

      date.substitute = substitute
      date._filter = _filter
      date._lock = _lock
      date.duration = duration

      return date
    })
    this.calEvent.dates = dates.concat(this.calEvent.dates)
  }

  time (rule) {
    this.calEvent.dates.forEach((date, i) => {
      this.calEvent.dates[i] = setHours(setMinutes(date, rule.minute), rule.hour)
    })
  }

  duration (rule) {
    this.calEvent.dates.forEach((date, i) => {
      this.calEvent.dates[i].duration = rule.duration
    })
  }

  bridge () {
    return true // needs postprocessing
  }

  /**
   * @param {object} rule
   * {
   *   rule: "year",
   *   cardinality: "leap",
   *   every: undefined,
   *   since: undefined
   * }
   */
  year (rule) {
    this.calEvent.dates = this.calEvent.dates.map((date) => {
      if (rule.cardinality) {
        if (rule.cardinality === 'leap' && this._isLeapYear(date.getFullYear())) {
          return date
        } else if (rule.cardinality === 'non-leap' && !this._isLeapYear(date.getFullYear())) {
          return date
        } else if (rule.cardinality === 'even' && (date.getFullYear() + 1) % 2) {
          return date
        } else if (rule.cardinality === 'odd' && date.getFullYear() % 2) {
          return date
        }
      } else if (rule.every !== undefined && rule.since !== undefined) {
        let tmp = (date.getFullYear() - rule.since) % rule.every
        if (tmp === 0) {
          return date
        }
      }
    }).filter((date) => {
      return date
    })
  }

  /**
   * @private
   * @return {Boolean} if true year is a leap year
   */
  _isLeapYear (year) {
    if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
      return true
    }
    return false
  }
}
module.exports = Rule
