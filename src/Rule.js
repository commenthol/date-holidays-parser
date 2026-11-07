/**
 * handle rule per event
 */

import CalDate from 'caldate'
import { DAYS, isNil } from './internal/utils.js'

/** @typedef {import('./CalEvent.js').default} CalEvent */
/** @typedef {import('./types.js').RuleToken} RuleToken */

export default class Rule {
  /**
   * @param {CalEvent} [calEvent]
   */
  constructor(calEvent) {
    this.calEvent = calEvent
  }

  /**
   * @param {CalEvent} calEvent
   */
  setEvent(calEvent) {
    this.calEvent = calEvent
    return this
  }

  /**
   * @return {CalEvent}
   */
  getEvent() {
    return this.calEvent
  }

  /**
   * @param {string} modifier
   */
  setModifier(modifier) {
    this.modifier = modifier
  }

  /**
   * resolves rule to function
   * @param {RuleToken} rule
   */
  resolve(rule) {
    if (rule.rule && typeof this[rule.rule] === 'function') {
      this[rule.rule](rule)
    } else if (rule.modifier) {
      this.modifier = rule.modifier
    }
    return this
  }

  /**
   * @param {RuleToken} rule
   * {
   *   rule: "dateDir",
   *   count: 1,
   *   weekday: "tuesday",
   *   direction: "after",
   *   omit: ['sunday']
   * }
   */
  dateDir(rule) {
    const omitWeekdays = []
      .concat(rule.omit)
      .map((weekday) => DAYS[weekday])
      .filter((v) => !isNil(v))

    const isOmitDay = (offset, weekday) => {
      let wd = offset + weekday
      while (wd < 0) {
        wd += 70
      }
      return omitWeekdays.includes(wd % 7)
    }

    this.calEvent.dates.forEach((date) => {
      let offset
      let count = rule.count - 1
      const weekday = date.getDay()
      const ruleWeekday = DAYS[rule.weekday]

      const isDirBefore = ['before', 'previous'].includes(rule.direction)
      // correct count if weekday is same for next direction
      if (rule.direction === 'next' && weekday === ruleWeekday) {
        count += 1
      }

      if (rule.weekday === 'day') {
        let i = 0
        if (isDirBefore) {
          offset = (count + 1) * -1
          while (i++ < 7 && isOmitDay(offset, weekday)) {
            offset -= 1
          }
        } else {
          offset = count + 1
          while (i++ < 7 && isOmitDay(offset, weekday)) {
            offset += 1
          }
        }
      } else {
        if (isDirBefore) {
          if (weekday === ruleWeekday) {
            count++
          }
          offset = (((7 + weekday - ruleWeekday) % 7) + count * 7) * -1
        } else {
          offset = ((7 - weekday + ruleWeekday) % 7) + count * 7
        }
      }
      if (offset) {
        date.setOffset(offset)
      }
    })
  }

  /**
   * @param {RuleToken} rule
   * {
   *   rule: "dateIfThen",
   *   if: ["sunday"],
   *   direction: "next",
   *   then: "sunday"
   * }
   */
  dateIfThen(rule) {
    const dates = []
    let offset

    this.calEvent.dates = this.calEvent.dates.map((date) => {
      if (date._lock) {
        return date
      }
      const weekday = date.getDay()
      if (~rule.if.indexOf(DAYS[weekday])) {
        if (this.modifier === 'and') {
          dates.push(new CalDate(date))
          date.substitute = true
        }
        date._filter = false
        const then = DAYS[rule.then]
        if (rule.then && then !== 'undefined') {
          offset = 0
          if (rule.direction === 'previous') {
            offset = -1 * ((7 + weekday - then) % 7)
            if (!offset) {
              offset = -7
            }
          } else {
            offset = (7 - weekday + then) % 7
            if (!offset) {
              offset = 7
            }
          }
          date.setOffset(offset)
          date._lock = true
          if (this.modifier === 'substitutes') date.substitute = true
        }
        ;(rule.rules || []).forEach((rule) => {
          switch (rule.rule) {
            case 'time':
              date.setTime(rule.hour, rule.minute)
              break
            case 'duration':
              date.duration = rule.duration
              break
          }
        })
      } else if (this.modifier === 'substitutes') {
        date._filter = true
      }
      return date
    })
    this.calEvent.dates = dates.concat(this.calEvent.dates)
  }

  /**
   * @param {RuleToken} rule
   * {
   *   rule: "weekday",
   *   if: ["sunday", "saturday"],
   *   not: false,
   * }
   */
  weekday(rule) {
    this.calEvent.dates = this.calEvent.dates
      .map((date) => {
        const weekday = date.getDay()
        let match = rule.if.indexOf(DAYS[weekday]) !== -1
        if (rule.not) match = !match
        if (match) return date
      })
      .filter((date) => date)
  }

  /** @param {RuleToken} rule */
  time(rule) {
    this.calEvent.dates.forEach((date) => {
      date.setTime(rule.hour, rule.minute)
    })
  }

  /** @param {RuleToken} rule */
  duration(rule) {
    this.calEvent.dates.forEach((date) => {
      date.duration = rule.duration
    })
  }

  bridge() {
    return true // needs postprocessing
  }

  ruleIfHoliday() {
    return true // needs postprocessing
  }

  /** @param {RuleToken} rule */
  activeFrom(rule) {
    this.calEvent.setActive({ from: new CalDate(rule).toDate() })
  }

  /** @param {RuleToken} rule */
  activeTo(rule) {
    this.calEvent.setActive({ to: new CalDate(rule).toDate() })
  }

  /**
   * @param {RuleToken} rule
   * {
   *   rule: "year",
   *   cardinality: "leap",
   *   every: undefined,
   *   since: undefined
   * }
   */
  year(rule) {
    this.calEvent.dates = this.calEvent.dates
      .map((date) => {
        if (rule.cardinality) {
          if (rule.cardinality === 'leap' && this._isLeapYear(date.year)) {
            return date
          } else if (
            rule.cardinality === 'non-leap' &&
            !this._isLeapYear(date.year)
          ) {
            return date
          } else if (rule.cardinality === 'even' && (date.year + 1) % 2) {
            return date
          } else if (rule.cardinality === 'odd' && date.year % 2) {
            return date
          }
        } else if (rule.every !== undefined && rule.since !== undefined) {
          const tmp = (date.year - rule.since) % rule.every
          if (tmp === 0) {
            return date
          }
        }
      })
      .filter((date) => date)
  }

  /**
   * @private
   * @return {Boolean} if true year is a leap year
   */
  _isLeapYear(year) {
    if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
      return true
    }
    return false
  }
}
