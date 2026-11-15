/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import CalBengali from 'date-bengali-revised'
import CalDate from 'caldate'

/** @type {CalendarPlugin<{ year: number, month: number, day: number }>} */
export const BengaliRevisedCalendarPlugin = {
  fnNames: ['bengali-revised'],

  parse(remainingRule) {
    const match =
      /^(bengali-revised) (?:-?0*(\d{1,4})-)?0?(\d{1,2})-0?(\d{1,2})/.exec(
        remainingRule
      )
    if (!match) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: match[0].length,
      value: {
        year: Number(match[2]) || 0,
        month: Number(match[3]) || 0,
        day: Number(match[4]) || 0
      }
    }
  },

  calculate(parsed, year) {
    const date = new CalDate(
      new CalBengali(year - 593, parsed.month, parsed.day).toGregorian()
    )
    return [{ year: date.year, month: date.month, day: date.day }]
  }
}
