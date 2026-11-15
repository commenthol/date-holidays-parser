/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import { calendar } from '../internal/hebrew-calendar.js'
import { mapCalendarDates } from '../internal/mapCalendarDates.js'

const months = {
  Nisan: 1,
  Iyyar: 2,
  Sivan: 3,
  Tamuz: 4,
  Av: 5,
  Elul: 6,
  Tishrei: 7,
  Cheshvan: 8,
  Kislev: 9,
  Tevet: 10,
  Shvat: 11,
  AdarII: 13,
  Adar: 12
}

const monthNames = Object.keys(months).join('|')

/** @type {CalendarPlugin<{ day: number, month: number, year: number }>} */
export const HebrewCalendarPlugin = {
  fnNames: ['hebrew'],

  parse(remainingRule) {
    const match = new RegExp(
      `^0?(\\d{1,2}) (${monthNames})(?: 0*(\\d{1,}))?`
    ).exec(remainingRule)
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
    return mapCalendarDates(calendar, parsed, year).map((date) => ({
      ...date,
      offsetMinutes: -360
    }))
  }
}
