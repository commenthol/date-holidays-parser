/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('../types.js').CalendarPlugin<TParsed>;
declare const calendars: {
    tibetan: any;
    mongolian: any;
    bhutanese: any;
};
/**
 * @type {CalendarPlugin<{
 *   fn: keyof typeof calendars, cycle: number, year: number,
 *   month: number, leapMonth: boolean, day: number, leapDay: boolean
 * }>}
 */
export declare const TibetanCalendarPlugin: CalendarPlugin<{
    fn: keyof typeof calendars;
    cycle: number;
    year: number;
    month: number;
    leapMonth: boolean;
    day: number;
    leapDay: boolean;
}>;
export {};
