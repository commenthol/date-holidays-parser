import CalDate from 'caldate'

/** @typedef {import('../types.js').CalendarData} CalendarData */
/** @typedef {import('../types.js').CalendarDate} CalendarDate */

/**
 * Map a Hebrew or Islamic calendar date into its Gregorian date.
 * @param {CalendarData} calendar
 * @param {{ day: number, month: number, year: number }} parsed
 * @param {number} gregorianYear
 * @returns {CalendarDate[]}
 */
export function mapCalendarDates(calendar, parsed, gregorianYear) {
  if (
    !calendar[gregorianYear - 1] ||
    !calendar[gregorianYear] ||
    !calendar[gregorianYear + 1]
  ) {
    return []
  }

  /** @type {CalendarDate[]} */
  const dates = []
  for (let year = gregorianYear - 1; year <= gregorianYear + 1; year++) {
    const firstDays = calendar[year][parsed.month - 1]
    if (!firstDays) continue

    for (let i = 0; i < firstDays.length; i += 3) {
      if (
        parsed.year &&
        parsed.year !== calendar.year + firstDays[i + 2]
      ) {
        continue
      }

      const date = new CalDate({
        year,
        month: firstDays[i] + 1,
        day: firstDays[i + 1]
      }).setOffset(parsed.day - 1)

      if (date.year === gregorianYear) {
        dates.push({ year: date.year, month: date.month, day: date.day })
      }
    }
  }
  return dates
}
