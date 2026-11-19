/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import { calendar } from '../internal/hijri-calendar.js'
import { mapCalendarDates } from '../internal/mapCalendarDates.js'

const months = [
  'Muharram',
  'Safar',
  'Rabi al-awwal',
  'Rabi al-thani',
  'Jumada al-awwal',
  'Jumada al-thani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qidah',
  'Dhu al-Hijjah'
]
const monthNumbers = Object.fromEntries(
  months.map((month, i) => [month, i + 1])
)
const monthNames = months.join('|')

/** @type {CalendarPlugin<{ day: number, month: number, year: number }>} */
export const HijriCalendarPlugin = {
  fnNames: ['islamic'],

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
        month: monthNumbers[match[2]],
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
