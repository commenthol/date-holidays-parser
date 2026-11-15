/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import {
  CalendarChinese,
  CalendarKorean,
  CalendarVietnamese
} from 'date-chinese'
import CalDate from 'caldate'

const calendars = {
  chinese: CalendarChinese,
  korean: CalendarKorean,
  vietnamese: CalendarVietnamese
}

/**
 * @type {CalendarPlugin<{
 *   fn: keyof typeof calendars, cycle: number, year: number,
 *   month: number, leapMonth: boolean, day: number, solarterm: number
 * }>}
 */
export const ChineseCalendarPlugin = {
  fnNames: ['chinese', 'korean', 'vietnamese'],

  parse(remainingRule) {
    const solarMatch =
      /^(chinese|korean|vietnamese) (?:(\d+)-(\d{1,2})-)?(\d{1,2})-(\d{1,2}) solarterm/.exec(
        remainingRule
      )
    if (solarMatch) {
      return {
        kind: 'match',
        consumed: solarMatch[0].length,
        value: {
          fn: /** @type {keyof typeof calendars} */ (solarMatch[1]),
          cycle: Number(solarMatch[2]) || 0,
          year: Number(solarMatch[3]) || 0,
          solarterm: Number(solarMatch[4]) || 0,
          day: Number(solarMatch[5]) || 0,
          month: 0,
          leapMonth: false
        }
      }
    }

    const lunarMatch =
      /^(chinese|korean|vietnamese) (?:(\d+)-(\d{1,2})-)?(\d{1,2})-([01])-(\d{1,2})/.exec(
        remainingRule
      )
    if (!lunarMatch) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: lunarMatch[0].length,
      value: {
        fn: /** @type {keyof typeof calendars} */ (lunarMatch[1]),
        cycle: Number(lunarMatch[2]) || 0,
        year: Number(lunarMatch[3]) || 0,
        month: Number(lunarMatch[4]) || 0,
        leapMonth: !!Number(lunarMatch[5]),
        day: Number(lunarMatch[6]) || 0,
        solarterm: 0
      }
    }
  },

  calculate(parsed, year) {
    const calendar = new calendars[parsed.fn]()
    let date
    if (parsed.solarterm) {
      date = new CalDate(
        calendar
          .fromJDE(calendar.solarTerm(parsed.solarterm, year))
          .toGregorian()
      ).setOffset(parsed.day - 1)
    } else {
      calendar.set(
        parsed.cycle,
        parsed.year,
        parsed.month,
        parsed.leapMonth,
        parsed.day
      )
      date = new CalDate(calendar.fromJDE(calendar.toJDE(year)).toGregorian())
    }
    return [{ year: date.year, month: date.month, day: date.day }]
  }
}
