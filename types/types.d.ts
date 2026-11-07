/**
 * Options shared by the calendar event implementations.
 *
 * @typedef {object} EventOptions
 * @property {string} [fn]
 * @property {number} [day]
 * @property {number} [month]
 * @property {number} [year]
 * @property {number} [offset]
 * @property {boolean} [substitute]
 * @property {string} [type]
 * @property {string} [season]
 * @property {string} [timezone]
 * @property {number} [cycle]
 * @property {boolean} [leapMonth]
 * @property {boolean} [leapDay]
 * @property {number} [solarterm]
 */
export type EventOptions = {
    fn?: string;
    day?: number;
    month?: number;
    year?: number;
    offset?: number;
    substitute?: boolean;
    type?: string;
    season?: string;
    timezone?: string;
    cycle?: number;
    leapMonth?: boolean;
    leapDay?: boolean;
    solarterm?: number;
};
export type RuleToken = {
    fn?: string;
    rule?: string;
    modifier?: string;
    type?: string;
    direction?: string;
    weekday?: string;
    then?: string;
    cardinality?: string;
    season?: string;
    timezone?: string;
    year?: number;
    month?: number;
    day?: number;
    offset?: number;
    count?: number;
    hour?: number;
    minute?: number;
    duration?: number;
    every?: number;
    since?: number;
    cycle?: number;
    solarterm?: number;
    not?: boolean;
    leapMonth?: boolean;
    leapDay?: boolean;
    if?: string[];
    omit?: string[];
    rules?: RuleToken[];
};
export type Location = {
    country: string;
    state?: string;
    region?: string;
};
export type ActiveRange = {
    from?: Date | string;
    to?: Date | string;
};
export type HolidayOptions = {
    name?: string | Record<string, string>;
    type?: string;
    substitute?: boolean;
    enable?: string[];
    disable?: string[];
    active?: ActiveRange[];
    fn?: import('./DateFn.js').default;
    rule?: string;
    languages?: string | string[];
    timezone?: string;
    types?: string[];
    data?: object;
};
export type HolidayRuleOptions = HolidayOptions & {
    rule: string;
};
export type Holiday = {
    date: string;
    start: Date;
    end: Date;
    name?: string | Record<string, string>;
    type?: string;
    rule?: string;
    substitute?: boolean;
};
export type HolidayMap = Record<string, HolidayOptions | false>;
export type CalendarData = Record<number, (number[] | null)[]> & {
    year: number;
    months?: number;
};
/**
 * A token produced by the holiday-rule parser.
 *
 * @typedef {object} RuleToken
 * @property {string} [fn]
 * @property {string} [rule]
 * @property {string} [modifier]
 * @property {string} [type]
 * @property {string} [direction]
 * @property {string} [weekday]
 * @property {string} [then]
 * @property {string} [cardinality]
 * @property {string} [season]
 * @property {string} [timezone]
 * @property {number} [year]
 * @property {number} [month]
 * @property {number} [day]
 * @property {number} [offset]
 * @property {number} [count]
 * @property {number} [hour]
 * @property {number} [minute]
 * @property {number} [duration]
 * @property {number} [every]
 * @property {number} [since]
 * @property {number} [cycle]
 * @property {number} [solarterm]
 * @property {boolean} [not]
 * @property {boolean} [leapMonth]
 * @property {boolean} [leapDay]
 * @property {string[]} [if]
 * @property {string[]} [omit]
 * @property {RuleToken[]} [rules]
 */
/**
 * @typedef {object} Location
 * @property {string} country
 * @property {string} [state]
 * @property {string} [region]
 */
/** @typedef {{ from?: Date|string, to?: Date|string }} ActiveRange */
/**
 * Options attached to a holiday rule. Additional data fields are preserved in
 * returned holiday objects.
 *
 * @typedef {object} HolidayOptions
 * @property {string|Record<string, string>} [name]
 * @property {string} [type]
 * @property {boolean} [substitute]
 * @property {string[]} [enable]
 * @property {string[]} [disable]
 * @property {ActiveRange[]} [active]
 * @property {import('./DateFn.js').default} [fn]
 * @property {string} [rule]
 * @property {string|string[]} [languages]
 * @property {string} [timezone]
 * @property {string[]} [types]
 * @property {object} [data]
 */
/** @typedef {HolidayOptions & { rule: string }} HolidayRuleOptions */
/**
 * A holiday occurrence returned by the public API.
 *
 * @typedef {object} Holiday
 * @property {string} date
 * @property {Date} start
 * @property {Date} end
 * @property {string|Record<string, string>} [name]
 * @property {string} [type]
 * @property {string} [rule]
 * @property {boolean} [substitute]
 */
/** @typedef {Record<string, HolidayOptions|false>} HolidayMap */
/** @typedef {Record<number, (number[]|null)[]> & { year: number, months?: number }} CalendarData */
export {};
