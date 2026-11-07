import { toNumber } from './internal/utils.js'

/** @typedef {import('./types.js').HolidayRuleOptions} HolidayRuleOptions */

/**
 * Holiday Rule
 * Apart from `rule` and `name` other options may be set
 * @constructor
 * @param {HolidayRuleOptions} ruleObj
 */
export class HolidayRule {
  constructor(ruleObj) {
    // eslint-disable-next-line no-unused-vars
    const { rule, fn, opts, ...other } = ruleObj
    Object.assign(this, { rule, ...other })
  }

  /**
   * disable rule in year (month)
   * @param {number} year
   * @param {number} [month] - 1..12
   */
  disableIn(year, month) {
    if (!toNumber(year)) return
    const monthValue =
      month === undefined
        ? undefined
        : month < 1 && month > 12
          ? undefined
          : month < 10
            ? '0' + Number(month)
            : String(month)
    const dateStr = [year, monthValue].filter(Boolean).join('-')
    this.disable = (this.disable || []).concat(dateStr).sort()
  }
}
