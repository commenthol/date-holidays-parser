export type RuleToken = import('./types.js').RuleToken;
export type HolidayMap = import('./types.js').HolidayMap;
export type HolidayOptions = import('./types.js').HolidayOptions;
/** @typedef {import('./types.js').RuleToken} RuleToken */
/** @typedef {import('./types.js').HolidayMap} HolidayMap */
/** @typedef {import('./types.js').HolidayOptions} HolidayOptions */
/**
 * handles one rule
 */
export default class DateFn {
    ruleStr: string;
    /** @type {RuleToken[]} */
    rules: RuleToken[];
    ok: boolean;
    holidays: import("./types.js").HolidayMap;
    opts: false | import("./types.js").HolidayOptions;
    event: import("./CalEvent.js").default;
    /** @type {Map<number, import('./CalEvent.js').default>} */
    cache: Map<number, import('./CalEvent.js').default>;
    /** @type {Set<number>} */
    calculating: Set<number>;
    /**
     * @param {string} ruleStr - unparsed rule
     * @param {HolidayMap} [holidays] - all holiday rules, used for bridge-day calculations
     */
    constructor(ruleStr: string, holidays?: HolidayMap);
    /**
     * @param {number} year
     * @returns {this}
     */
    inYear(year: number): this;
    isCalculating(year: any): boolean;
    get(timezone: any): {
        date: any;
        start: any;
        end: any;
    }[];
}
