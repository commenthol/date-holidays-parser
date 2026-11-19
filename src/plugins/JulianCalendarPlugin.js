/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import { julian } from 'astronomia'
import CalDate from 'caldate'

/** @type {CalendarPlugin<{ year: number, month: number, day: number }>} */
export const JulianCalendarPlugin = {
  fnNames: ['julian'],

  parse(remainingRule) {
    const match = /^julian (?:0*(\d{1,4})-)?0?(\d{1,2})-0?(\d{1,2})/.exec(
      remainingRule
    )
    if (!match) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: match[0].length,
      value: {
        year: Number(match[1]) || 0,
        month: Number(match[2]) || 0,
        day: Number(match[3]) || 0
      }
    }
  },

  calculate(parsed, year) {
    if (parsed.year && parsed.year !== year) return []
    const date = new CalDate(
      new julian.CalendarJulian(year, parsed.month, parsed.day).toGregorian()
    )
    return [{ year: date.year, month: date.month, day: date.day }]
  }
}
