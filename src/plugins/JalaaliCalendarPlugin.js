/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import CalDate from 'caldate'
import { toJalaali, toGregorian } from 'jalaali-js'

const months = {
  Farvardin: 1,
  Ordibehesht: 2,
  Khordad: 3,
  Tir: 4,
  Mordad: 5,
  Shahrivar: 6,
  Mehr: 7,
  Aban: 8,
  Azar: 9,
  Dey: 10,
  Bahman: 11,
  Esfand: 12
}

/** @type {CalendarPlugin<{ day: number, month: number, year: number }>} */
export const JalaaliCalendarPlugin = {
  fnNames: ['jalaali'],

  parse(remainingRule) {
    const match =
      /^0?(\d{1,2}) (Farvardin|Ordibehesht|Khordad|Tir|Mordad|Shahrivar|Mehr|Aban|Azar|Dey|Bahman|Esfand)(?: 0*(\d{1,}))?/.exec(
        remainingRule
      )
    if (!match) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: match[0].length,
      value: {
        day: Number(match[1]) || 0,
        month: months[match[2]],
        year: Number(match[3]) || 0
      }
    }
  },

  calculate(parsed, year) {
    const nowruz = toJalaali(year, 1, 1)
    if (parsed.year && nowruz.jy !== parsed.year) return []
    const date = toGregorian(parsed.year || nowruz.jy, parsed.month, parsed.day)
    const result = new CalDate({ year: date.gy, month: date.gm, day: date.gd })
    return [{ year: result.year, month: result.month, day: result.day }]
  }
}
