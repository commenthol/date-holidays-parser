import CalEvent from './CalEvent.js';
import CalendarPluginRegistry from './CalendarPluginRegistry.js';
export type RuleToken = import('./types.js').RuleToken;
export type HolidayMap = import('./types.js').HolidayMap;
export type HolidayOptions = import('./types.js').HolidayOptions;
export type CalendarContext = import('./types.js').CalendarContext;
export type RuleDate = import('./types.js').RuleDate;
export type CalendarPluginRegistryType = import('./CalendarPluginRegistry.js').default;
/**
 * handles one rule
 */
export default class DateFn {
    calendarPluginRegistry: CalendarPluginRegistry;
    calendarContext: import("./types.js").CalendarContext;
    ruleStr: string;
    /** @type {RuleToken[]} */
    rules: RuleToken[];
    ok: boolean;
    errorMessage: string;
    holidays: import("./types.js").HolidayMap;
    opts: false | import("./types.js").HolidayOptions;
    event: CalEvent;
    /** @type {Map<string, CalEvent>} */
    cache: Map<string, CalEvent>;
    /** @type {Set<number>} */
    calculating: Set<number>;
    /**
     * @param {string} ruleStr - unparsed rule
     * @param {HolidayMap} [holidays] - all holiday rules, used for bridge-day calculations
     * @param {CalendarPluginRegistryType} [calendarPluginRegistry]
     * @param {CalendarContext} [calendarContext]
     */
    constructor(ruleStr: string, holidays?: HolidayMap, calendarPluginRegistry?: CalendarPluginRegistryType, calendarContext?: CalendarContext);
    /**
     * @param {number} year
     * @returns {this}
     */
    inYear(year: number): this;
    /** @param {number} year */
    isCalculating(year: number): boolean;
    /** @param {string} [timezone] */
    get(timezone?: string): {
        date: string;
        start: Date;
        end: Date;
    }[];
}
