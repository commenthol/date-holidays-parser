export type HolidayRuleOptions = import('./types.js').HolidayRuleOptions;
/** @typedef {import('./types.js').HolidayRuleOptions} HolidayRuleOptions */
/**
 * Holiday Rule
 * Apart from `rule` and `name` other options may be set
 * @constructor
 * @param {HolidayRuleOptions} ruleObj
 */
export declare class HolidayRule {
    disable: any;
    constructor(ruleObj: any);
    /**
     * disable rule in year (month)
     * @param {number} year
     * @param {number} [month] - 1..12
     */
    disableIn(year: number, month?: number): void;
}
