/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('../types.js').CalendarPlugin<TParsed>;
import { CalendarChinese, CalendarKorean, CalendarVietnamese } from 'date-chinese';
declare const calendars: {
    chinese: typeof CalendarChinese;
    korean: typeof CalendarKorean;
    vietnamese: typeof CalendarVietnamese;
};
/**
 * @type {CalendarPlugin<{
 *   fn: keyof typeof calendars, cycle: number, year: number,
 *   month: number, leapMonth: boolean, day: number, solarterm: number
 * }>}
 */
export declare const ChineseCalendarPlugin: CalendarPlugin<{
    fn: keyof typeof calendars;
    cycle: number;
    year: number;
    month: number;
    leapMonth: boolean;
    day: number;
    solarterm: number;
}>;
export {};
