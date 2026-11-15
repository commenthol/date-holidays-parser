/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('../types.js').CalendarPlugin<TParsed>;
/** @type {CalendarPlugin<{ year: number, month: number, day: number }>} */
export declare const JulianCalendarPlugin: CalendarPlugin<{
    year: number;
    month: number;
    day: number;
}>;
