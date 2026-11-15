/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('../types.js').CalendarPlugin<TParsed>;
/** @type {CalendarPlugin<{ season: string, timezone: string }>} */
export declare const EquinoxCalendarPlugin: CalendarPlugin<{
    season: string;
    timezone: string;
}>;
