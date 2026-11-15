import CalDate from 'caldate'
import CalEvent from './CalEvent.js'
import CalendarPluginRegistry from './CalendarPluginRegistry.js'
import Parser from './Parser.js'
import Rule from './Rule.js'
import PostRule from './PostRule.js'

/** @typedef {import('./types.js').RuleToken} RuleToken */
/** @typedef {import('./types.js').HolidayMap} HolidayMap */
/** @typedef {import('./types.js').HolidayOptions} HolidayOptions */
/** @typedef {import('./types.js').CalendarContext} CalendarContext */
/** @typedef {import('./types.js').RuleDate} RuleDate */
/** @typedef {import('./CalendarPluginRegistry.js').default} CalendarPluginRegistryType */

/**
 * Convert plugin output into the internal event representation.
 * @param {{ plugin: import('./types.js').CalendarPlugin<unknown>, value: unknown }} calendar
 * @param {number} year
 * @param {CalendarContext} context
 * @returns {CalEvent}
 */
function calendarEvent(calendar, year, context) {
  const event = new CalEvent()
  for (let calendarYear = year - 1; calendarYear <= year + 1; calendarYear++) {
    const dates = calendar.plugin.calculate(
      calendar.value,
      calendarYear,
      context
    )
    for (const date of dates) {
      /** @type {RuleDate} */
      const calDate = new CalDate(date)
      if (date.offsetMinutes !== undefined) {
        calDate._calendarOffsetMinutes = date.offsetMinutes
      }
      if (date.duration !== undefined) {
        calDate.setDuration(date.duration)
        calDate._calendarDuration = date.duration
      }
      event.dates.push(calDate)
    }
  }
  return event
}

/**
 * handles one rule
 */
export default class DateFn {
  /**
   * @param {string} ruleStr - unparsed rule
   * @param {HolidayMap} [holidays] - all holiday rules, used for bridge-day calculations
   * @param {CalendarPluginRegistryType} [calendarPluginRegistry]
   * @param {CalendarContext} [calendarContext]
   */
  constructor(ruleStr, holidays, calendarPluginRegistry, calendarContext = {}) {
    this.calendarPluginRegistry =
      calendarPluginRegistry || new CalendarPluginRegistry()
    this.calendarContext = calendarContext
    const parser = new Parser(undefined, this.calendarPluginRegistry)
    this.ruleStr = ruleStr
    /** @type {RuleToken[]} */
    this.rules = parser.parse(ruleStr)
    this.ok = !parser.error
    this.errorMessage = parser.errorMessage
    this.holidays = holidays
    this.opts = holidays ? holidays[ruleStr] : {}
    this.event = undefined
    /** @type {Map<string, CalEvent>} */
    this.cache = new Map()
    /** @type {Set<number>} */
    this.calculating = new Set()
  }

  /**
   * @param {number} year
   * @returns {this}
   */
  inYear(year) {
    const cacheKey = year + ':' + (this.calendarContext.timezone || '')
    if (this.cache.has(cacheKey)) {
      this.event = this.cache.get(cacheKey)
      return this
    }

    this.calculating.add(year)
    try {
      // current rule
      /** @type {Rule | undefined} */
      let ruleFn
      const postProc = new PostRule(this.ruleStr, this.opts, this.holidays)

      this.rules.forEach((rule) => {
        if (rule.fn) {
          const calEvent = rule.calendar
            ? calendarEvent(rule.calendar, year, this.calendarContext)
            : new CalEvent(rule)
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
      this.cache.set(cacheKey, event)

      this.event = event
      return this
    } finally {
      this.calculating.delete(year)
    }
  }

  /** @param {number} year */
  isCalculating(year) {
    return this.calculating.has(year)
  }

  /** @param {string} [timezone] */
  get(timezone) {
    return this.event.get(timezone, this.calendarContext.timezoneAdapter)
  }
}
