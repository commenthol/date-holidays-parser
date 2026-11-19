/** @typedef {import('./types.js').CalendarDate} CalendarDate */
/** @typedef {import('./types.js').CalendarContext} CalendarContext */
/** @template TParsed @typedef {import('./types.js').CalendarParseResult<TParsed>} CalendarParseResult */
/** @template TParsed @typedef {import('./types.js').CalendarPlugin<TParsed>} CalendarPlugin */
/** @typedef {import('./types.js').HolidaysOptions} HolidaysOptions */
/** @typedef {import('./types.js').Location} Location */
/** @typedef {import('./types.js').ActiveRange} ActiveRange */
/** @typedef {import('./types.js').HolidayOptions} HolidayOptions */
/** @typedef {import('./types.js').HolidayRuleOptions} HolidayRuleOptions */
/** @typedef {import('./types.js').Holiday} Holiday */
/** @typedef {import('./types.js').HolidayMap} HolidayMap */
/** @typedef {import('./types.js').HolidayType} HolidayType */
export type CalendarDate = import('./types.js').CalendarDate;
export type CalendarContext = import('./types.js').CalendarContext;
export type CalendarParseResult<TParsed> = import('./types.js').CalendarParseResult<TParsed>;
export type CalendarPlugin<TParsed> = import('./types.js').CalendarPlugin<TParsed>;
export type HolidaysOptions = import('./types.js').HolidaysOptions;
export type Location = import('./types.js').Location;
export type ActiveRange = import('./types.js').ActiveRange;
export type HolidayOptions = import('./types.js').HolidayOptions;
export type HolidayRuleOptions = import('./types.js').HolidayRuleOptions;
export type Holiday = import('./types.js').Holiday;
export type HolidayMap = import('./types.js').HolidayMap;
export type HolidayType = import('./types.js').HolidayType;
export { Holidays as default } from './Holidays.js';
export * from './HolidayRule.js';
