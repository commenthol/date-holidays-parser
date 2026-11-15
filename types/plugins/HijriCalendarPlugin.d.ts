/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('../types.js').CalendarPlugin<TParsed>;
/** @type {CalendarPlugin<{ day: number, month: number, year: number }>} */
export declare const HijriCalendarPlugin: CalendarPlugin<{
    day: number;
    month: number;
    year: number;
}>;
