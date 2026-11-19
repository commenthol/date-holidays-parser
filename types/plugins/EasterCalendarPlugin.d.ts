/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('../types.js').CalendarPlugin<TParsed>;
/** @type {CalendarPlugin<{ type: string, offset: number }>} */
export declare const EasterCalendarPlugin: CalendarPlugin<{
    type: string;
    offset: number;
}>;
