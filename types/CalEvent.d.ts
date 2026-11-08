export type EventOptions = import('./types.js').EventOptions;
export type ActiveRange = import('./types.js').ActiveRange;
export type RuleDate = import('./types.js').RuleDate;
/** @typedef {import('./types.js').EventOptions} EventOptions */
/** @typedef {import('./types.js').ActiveRange} ActiveRange */
/** @typedef {import('./types.js').RuleDate} RuleDate */
export default class CalEvent {
    substitute: boolean;
    /** @type {EventOptions} */
    opts: EventOptions;
    offset: number;
    /** @type {RuleDate[]} */
    dates: RuleDate[];
    /** @type {ActiveRange[]|undefined} */
    active: ActiveRange[] | undefined;
    /**
     * @param {EventOptions|Date} [opts={}] event options or a date
     */
    constructor(opts?: EventOptions | Date);
    /**
     * @param {number} year
     * @returns {this}
     */
    inYear(year: number): this;
    reset(): void;
    /**
     * @param {CalEvent} calEvent
     * @returns {boolean}
     */
    isEqualDate(calEvent: CalEvent): boolean;
    /**
     * Filter out disabled dates
     * @param {number} year
     * @param {number} month
     * @returns {this}
     */
    filterDisabled(year: number, month: number): this;
    /**
     * @param {number} year - year to filter
     * @param {ActiveRange[]} [active=this.active] - active date ranges
     * @return {this} for chaining
     */
    filterActive(year: number, active?: ActiveRange[]): this;
    /**
     * @param {ActiveRange} active
     * @returns {this}
     */
    setActive(active: ActiveRange): this;
    /**
     * @param {CalEvent} calEvent
     */
    push(calEvent: CalEvent): void;
    /**
     * @param {string} timezone
     * @returns
     */
    get(timezone: string): {
        date: string;
        start: Date;
        end: Date;
    }[];
    _addSubstitute(date: any, obj: any): void;
}
