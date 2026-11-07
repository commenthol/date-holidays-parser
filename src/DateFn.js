import Parser from './Parser.js'
import Rule from './Rule.js'
import PostRule from './PostRule.js'
import { CalEventFactory } from './CalEventFactory.js'

/** @typedef {import('./types.js').RuleToken} RuleToken */
/** @typedef {import('./types.js').HolidayMap} HolidayMap */
/** @typedef {import('./types.js').HolidayOptions} HolidayOptions */

/**
 * handles one rule
 */
export default class DateFn {
  /**
   * @param {string} ruleStr - unparsed rule
   * @param {HolidayMap} [holidays] - all holiday rules, used for bridge-day calculations
   */
  constructor(ruleStr, holidays) {
    const parser = new Parser()
    this.ruleStr = ruleStr
    /** @type {RuleToken[]} */
    this.rules = parser.parse(ruleStr)
    this.ok = !parser.error
    this.holidays = holidays
    this.opts = holidays ? holidays[ruleStr] : {}
    this.event = undefined
    /** @type {Map<number, import('./CalEvent.js').default>} */
    this.cache = new Map()
    /** @type {Set<number>} */
    this.calculating = new Set()
  }

  /**
   * @param {number} year
   * @returns {this}
   */
  inYear(year) {
    if (this.cache.has(year)) {
      this.event = this.cache.get(year)
      return this
    }

    this.calculating.add(year)
    try {
      let ruleFn // current rule
      const postProc = new PostRule(this.ruleStr, this.opts, this.holidays)

      this.rules.forEach((rule) => {
        if (rule.fn) {
          const calEvent = new CalEventFactory(rule)
            .inYear(year - 1) // run over neighboring dates to catch overlaps
            .inYear(year)
            .inYear(year + 1)
          postProc.push(calEvent)
          ruleFn = new Rule(calEvent)
        } else {
          if (ruleFn.resolve(rule)) {
            postProc.resolve(rule, year)
          }
        }
      })

      const event = postProc.getEvent(year)
      this.cache.set(year, event)

      this.event = event
      return this
    } finally {
      this.calculating.delete(year)
    }
  }

  isCalculating(year) {
    return this.calculating.has(year)
  }

  get(timezone) {
    return this.event.get(timezone)
  }
}
