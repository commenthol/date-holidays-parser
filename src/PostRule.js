import { get as _get, toNumber } from './utils.js'
import Rule from './Rule.js'
import CalEvent from './CalEvent.js'

export default class PostRule {
  /**
   * @param {String} ruleStr
   * @param {Object} opts
   * @param {Array} [holidays]
   */
  constructor (ruleStr, opts, holidays) {
    this.opts = opts
    this.ruleStr = ruleStr
    this.ruleSet = holidays && holidays[ruleStr]
    this.holidays = holidays
    this.events = []
  }

  push (calEvent) {
    this.events.push(calEvent)
  }

  /**
   * @param {number} year
   * @returns {CalEvent}
   */
  getEvent (year) {
    const active = this.ruleSet && this.ruleSet.active
    this.disable(year)
    const ev = this.events[0]
    ev.filterActive(year, active)
    return ev
  }

  /**
   * @param {Array} rule
   * @param {number} year
   */
  resolve (rule, year) {
    if (rule.rule && typeof this[rule.rule] === 'function') {
      this[rule.rule](rule, year)
    }
  }

  /**
   * @param {Array} rule
   * @param {number} year
   */
  bridge (rule, year) {
    const found = new Array(this.events.length).fill(false)
    found[0] = true
    const type = rule.type || 'public'

    // get all holidays of the given year
    for (const ruleStr in this.holidays) {
      const dateFn = this.holidays[ruleStr].fn
      if (dateFn && dateFn.ruleStr !== this.ruleStr) {
        const tmpEv = dateFn.inYear(year)
        const tmpEvType = _get(tmpEv, 'opts.type') || 'public'
        for (let i = 1; i < this.events.length; i++) {
          if (found[i]) continue
          const isEqualDate = tmpEv.event.isEqualDate(this.events[i])
          if (isEqualDate && tmpEvType === type) {
            found[i] = true
          }
        }
      }
      if (!~found.indexOf(false)) { // pre-exit if all found
        break
      }
    }

    if (~found.indexOf(false)) {
      this.events[0].reset()
    }
  }

  ruleIfHoliday (rule, year) {
    const type = rule.type || 'public'

    // get all holidays of the given year
    for (const ruleStr in this.holidays) {
      const dateFn = this.holidays[ruleStr].fn
      if (dateFn && dateFn.ruleStr !== this.ruleStr) {
        const tmpEv = dateFn.inYear(year)
        const tmpEvType = _get(tmpEv, 'opts.type') || 'public'
        for (let i = 0; i < this.events.length; i++) {
          const isEqualDate = tmpEv.event.isEqualDate(this.events[i])
          if (isEqualDate && tmpEvType === type) {
            new Rule(this.events[i]).resolve({ ...rule, rule: 'dateDir' })
            return
          }
        }
      }
    }
  }

  /**
   * @param {number} year
   */
  disable (year) {
    const { disable, enable } = this.opts || {}
    if (!disable || !disable.length) return

    const ev = this.events[0]

    // check if exact event was disabled or moved
    let tmpEv = _findEventInYear(year, disable)
    if (tmpEv) {
      if (tmpEv.isEqualDate(ev)) {
        ev.reset()
        tmpEv = _findEventInYear(year, enable)
        if (tmpEv) this.events[0] = tmpEv
      }
      return
    }

    // simply check if the event can be disabled for year-(month)
    const [_year, _month] = _findDisabled(year, disable)
    ev.filterDisabled(_year, _month)
  }
}

const isoDate = (isoDateStr) => String(isoDateStr).split('-').map(v => toNumber(v))

function _findEventInYear (_year, arr = []) {
  for (const item of arr) {
    const [year, month, day] = isoDate(item)
    if (year === _year && month && day) {
      return new CalEvent({ year, month, day }).inYear(year)
    }
  }
}

function _findDisabled (_year, arr = []) {
  for (const isoDateStr of arr) {
    const [year, month] = isoDate(isoDateStr)
    if (_year === year) {
      return [year, month]
    }
  }
  return []
}
