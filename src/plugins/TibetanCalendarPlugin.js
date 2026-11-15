/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import {
  CalendarTibetan,
  CalendarMongolian,
  CalendarBhutanese
} from '@hnw/date-tibetan'
import CalDate from 'caldate'

const calendars = {
  tibetan: CalendarTibetan,
  mongolian: CalendarMongolian,
  bhutanese: CalendarBhutanese
}

/**
 * @type {CalendarPlugin<{
 *   fn: keyof typeof calendars, cycle: number, year: number,
 *   month: number, leapMonth: boolean, day: number, leapDay: boolean
 * }>}
 */
export const TibetanCalendarPlugin = {
  fnNames: ['tibetan', 'mongolian', 'bhutanese'],

  parse(remainingRule) {
    const match =
      /^(tibetan|mongolian|bhutanese) (?:(\d+)-(\d{1,2})-)?(\d{1,2})-([01])-(\d{1,2})(?:-([01]))?/.exec(
        remainingRule
      )
    if (!match) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: match[0].length,
      value: {
        fn: /** @type {keyof typeof calendars} */ (match[1]),
        cycle: Number(match[2]) || 0,
        year: Number(match[3]) || 0,
        month: Number(match[4]) || 0,
        leapMonth: !!Number(match[5]),
        day: Number(match[6]) || 0,
        leapDay: !!Number(match[7])
      }
    }
  },

  calculate(parsed, year) {
    const calendar = new calendars[parsed.fn]()
    calendar.set(
      parsed.cycle,
      parsed.year,
      parsed.month,
      parsed.leapMonth,
      parsed.day,
      parsed.leapDay
    )
    const date = new CalDate(calendar.toGregorian(year))
    return [{ year: date.year, month: date.month, day: date.day }]
  }
}
