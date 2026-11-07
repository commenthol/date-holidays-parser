import CalEvent from './CalEvent.js';
export type HolidayMap = import('./types.js').HolidayMap;
export type HolidayOptions = import('./types.js').HolidayOptions;
export type RuleToken = import('./types.js').RuleToken;
/** @typedef {import('./types.js').HolidayMap} HolidayMap */
/** @typedef {import('./types.js').HolidayOptions} HolidayOptions */
/** @typedef {import('./types.js').RuleToken} RuleToken */
export default class PostRule {
    opts: false | import("./types.js").HolidayOptions;
    ruleStr: string;
    ruleSet: false | import("./types.js").HolidayOptions;
    holidays: import("./types.js").HolidayMap;
    /** @type {CalEvent[]} */
    events: CalEvent[];
    /**
     * @param {string} ruleStr
     * @param {HolidayOptions|false} [opts]
     * @param {HolidayMap} [holidays]
     */
    constructor(ruleStr: string, opts?: HolidayOptions | false, holidays?: HolidayMap);
    push(calEvent: any): void;
    /**
     * @param {number} year
     * @returns {CalEvent}
     */
    getEvent(year: number): CalEvent;
    /**
     * @param {RuleToken} rule
     * @param {number} year
     */
    resolve(rule: RuleToken, year: number): void;
    /**
     * @param {RuleToken} rule
     * @param {number} year
     */
    bridge(rule: RuleToken, year: number): void;
    /** @param {RuleToken} rule @param {number} year */
    ruleIfHoliday(rule: RuleToken, year: number): void;
    /**
     * @param {number} year
     */
    disable(year: number): void;
}
