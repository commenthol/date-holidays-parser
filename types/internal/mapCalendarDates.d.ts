export type CalendarData = import('../types.js').CalendarData;
export type CalendarDate = import('../types.js').CalendarDate;
/** @typedef {import('../types.js').CalendarData} CalendarData */
/** @typedef {import('../types.js').CalendarDate} CalendarDate */
/**
 * Map a Hebrew or Islamic calendar date into its Gregorian date.
 * @param {CalendarData} calendar
 * @param {{ day: number, month: number, year: number }} parsed
 * @param {number} gregorianYear
 * @returns {CalendarDate[]}
 */
export declare function mapCalendarDates(calendar: CalendarData, parsed: {
    day: number;
    month: number;
    year: number;
}, gregorianYear: number): CalendarDate[];
