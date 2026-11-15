/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import easter from 'date-easter'
import CalDate from 'caldate'

/** @type {CalendarPlugin<{ type: string, offset: number }>} */
export const EasterCalendarPlugin = {
  fnNames: ['easter'],

  parse(remainingRule) {
    const match = /^(easter|orthodox)(?: ([-+]?\d{1,2}) ?(?:days?|d)?)?/.exec(
      remainingRule
    )
    if (!match) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: match[0].length,
      value: { type: match[1], offset: Number(match[2]) || 0 }
    }
  },

  calculate(parsed, year) {
    const easterFn =
      parsed.type === 'orthodox' ? easter.orthodoxEaster : easter.easter
    const date = new CalDate(easterFn(year)).setOffset(parsed.offset)
    return [{ year: date.year, month: date.month, day: date.day }]
  }
}
