/**
 * handle rule per event
 */
export type CalEvent = import('./CalEvent.js').default;
export type RuleToken = import('./types.js').RuleToken;
/** @typedef {import('./CalEvent.js').default} CalEvent */
/** @typedef {import('./types.js').RuleToken} RuleToken */
export default class Rule {
    calEvent: import("./CalEvent.js").default;
    modifier: string;
    /**
     * @param {CalEvent} [calEvent]
     */
    constructor(calEvent?: CalEvent);
    /**
     * @param {CalEvent} calEvent
     */
    setEvent(calEvent: CalEvent): this;
    /**
     * @return {CalEvent}
     */
    getEvent(): CalEvent;
    /**
     * @param {string} modifier
     */
    setModifier(modifier: string): void;
    /**
     * resolves rule to function
     * @param {RuleToken} rule
     */
    resolve(rule: RuleToken): this;
    /**
     * @param {RuleToken} rule
     * {
     *   rule: "dateDir",
     *   count: 1,
     *   weekday: "tuesday",
     *   direction: "after",
     *   omit: ['sunday']
     * }
     */
    dateDir(rule: RuleToken): void;
    /**
     * @param {RuleToken} rule
     * {
     *   rule: "dateIfThen",
     *   if: ["sunday"],
     *   direction: "next",
     *   then: "sunday"
     * }
     */
    dateIfThen(rule: RuleToken): void;
    /**
     * @param {RuleToken} rule
     * {
     *   rule: "weekday",
     *   if: ["sunday", "saturday"],
     *   not: false,
     * }
     */
    weekday(rule: RuleToken): void;
    /** @param {RuleToken} rule */
    time(rule: RuleToken): void;
    /** @param {RuleToken} rule */
    duration(rule: RuleToken): void;
    bridge(): boolean;
    ruleIfHoliday(): boolean;
    /** @param {RuleToken} rule */
    activeFrom(rule: RuleToken): void;
    /** @param {RuleToken} rule */
    activeTo(rule: RuleToken): void;
    /**
     * @param {RuleToken} rule
     * {
     *   rule: "year",
     *   cardinality: "leap",
     *   every: undefined,
     *   since: undefined
     * }
     */
    year(rule: RuleToken): void;
    /**
     * @private
     * @return {Boolean} if true year is a leap year
     */
    private _isLeapYear;
}
