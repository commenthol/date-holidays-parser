import { toNumber } from './internal/utils.js'

/**
 * Holiday Rule
 * Apart from `rule` and `name` other options may be set
 * @constructor
 * @param {object} ruleObj
 * @param {string} ruleObj.rule - the rule string
 * @param {string|object} [ruleObj.name] - the name of the holiday, plain or with i18n
 * @param {string} [ruleObj.type] - type of holiday
 * @param {boolean} [ruleObj.substitute] - substitute holiday
 * @param {object[]} [ruleObj.active] - active `[{from?: str, to?: str}]`
 */
export class HolidayRule {
  constructor (ruleObj) {
    const { rule, fn, opts, ...other } = ruleObj
    Object.assign(this, { rule, ...other })
  }

  /**
   * disable rule in year (month)
   * @param {number} year
   * @param {number} [month] - 1..12
   */
  disableIn (year, month) {
    if (!toNumber(year)) return
    month = month < 1 && month > 12
      ? undefined
      : month < 10 ? '0' + Number(month) : month
    const dateStr = [year, month].filter(Boolean).join('-')
    this.disable = (this.disable || []).concat(dateStr).sort()
  }
}
