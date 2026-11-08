/**
 * @copyright 2016- (c) commenthol
 * @license ISC
 */
import Data from './Data.js';
import { HolidayRule } from './HolidayRule.js';
export type HolidayOptions = import('./types.js').HolidayOptions;
export type HolidayRuleOptions = import('./types.js').HolidayRuleOptions;
export type Holiday = import('./types.js').Holiday;
export type Location = import('./types.js').Location;
export type HolidayMap = import('./types.js').HolidayMap;
/**
 * @class
 * @param {object} data - holiday data object - see data/holidays.json
 * @param {string|Location} [country] - country code or location object
 * @param {string} [state] - specifies state
 * @param {string} [region] - specifies region
 * @param {HolidayOptions} [opts] - options
 * @example
 * ```js
 * new Holidays(data, 'US', 'la', 'no') // is the same as
 * new Holidays(data, 'us.la.no')       // is the same as
 * new Holidays(data, { country: 'us', state: 'la', region: 'no'})
 * ```
 */
export declare class Holidays {
    _data: any;
    __conf: any;
    __types: string[];
    /** @type {HolidayMap} */
    holidays: HolidayMap;
    __data: Data;
    __timezone: any;
    __languages: any[];
    constructor(data: any, country: any, state: any, region: any, opts: any);
    /**
     * initialize holidays for a country/state/region
     * @param {string|Location|HolidayOptions} [country]
     * @param {string|HolidayOptions} [state]
     * @param {string|HolidayOptions} [region]
     * @param {HolidayOptions} [opts]
     */
    init(country?: string | Location | HolidayOptions, state?: string | HolidayOptions, region?: string | HolidayOptions, opts?: HolidayOptions): boolean;
    /**
     * set (custom) holiday
     * @throws {TypeError}
     * @param {string} rule - rule for holiday or date in ISO format
     * @param {HolidayOptions|string|false} [opts] - holiday options or a name; `false` removes a rule
     * @returns {boolean} whether the holiday could be set
     */
    setHoliday(rule: string, opts?: HolidayOptions | string | false): boolean;
    /**
     * get all holidays for `year` with names using preferred `language`
     * @param {number|string|Date} [year] - if omitted, the current year is chosen
     * @param {string} [language] - ISO 639-1 code for language
     * @returns {Holiday[]} of found holidays in given year sorted by date
     * ```
     * {String} date - ISO Date String of (start)-date in local format
     * {Date} start - start date of holiday
     * {Date} end - end date of holiday
     * {String} name - name of holiday using `language` (if available)
     * {String} type - type of holiday `public|bank|school|observance`
     * ```
     */
    getHolidays(year?: number | string | Date, language?: string): Holiday[];
    /**
     * check whether `date` is a holiday or not
     * @param {Date|string} [date]
     * @returns {Holiday[]|false} holiday:
     * ```
     * {String} date - ISO Date String of (start)-date in local format
     * {Date} start - start date of holiday
     * {Date} end - end date of holiday
     * {String} name - name of holiday using `language` (if available)
     * {String} type - type of holiday `public|bank|school|observance`
     * ```
     */
    isHoliday(date?: Date | string): Holiday[] | false;
    /**
     * set or update rule
     * @param {HolidayRuleOptions} holidayRule
     * @returns {boolean} `true` if holiday could be set, returns `true`
     */
    setRule(holidayRule: HolidayRuleOptions): boolean;
    /**
     * unset rule
     * @param {String} rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31st Dec
     * @returns {boolean} `true` if holiday could be set, returns `true`
     */
    unsetRule(rule: string): boolean;
    /**
     * get available rules for selected country, (state, region)
     * @returns {HolidayRule[]}
     */
    getRules(): HolidayRule[];
    /**
     * get rule for selected country, (state, region)
     * @param {String} rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31st Dec
     * @returns {HolidayRule|undefined}
     */
    getRule(rule: string): HolidayRule | undefined;
    /**
     * Query for available Countries, States, Regions
     * @param {String} [country]
     * @param {String} [state]
     * @param {String} [lang] - ISO-639 language shortcode
     * @returns {Object} shortcode, name pairs of supported countries, states, regions
     */
    query(country?: string, state?: string, lang?: string): any;
    /**
     * get supported countries
     * @param {String} [lang] - ISO-639 language shortcode
     * @returns {Object} shortcode, name pairs of supported countries
     * ```js
     * { AD: 'Andorra',
     *   US: 'United States' }
     * ```
     */
    getCountries(lang?: string): any;
    /**
     * get supported states for a given country
     * @param {String} country - shortcode of country
     * @param {String} [lang] - ISO-639 language shortcode
     * @returns {Object} shortcode, name pairs of supported states, regions
     * ```js
     * { al: 'Alabama', ...
     *   wy: 'Wyoming' }
     * ```
     */
    getStates(country: string, lang?: string): any;
    /**
     * get supported regions for a given country, state
     * @param {String} country - shortcode of country
     * @param {String} state - shortcode of state
     * @param {String} [lang] - ISO-639 language shortcode
     * @returns {Object} shortcode, name pairs of supported regions
     * ```js
     * { no: 'New Orleans' }
     * ```
     */
    getRegions(country: string, state: string, lang?: string): any;
    /**
     * sets timezone
     * @param {String} timezone - see `moment-timezone`
     * if `timezone` is `undefined`, then all dates are considered local dates
     */
    setTimezone(timezone: string): void;
    /**
     * get timezones for country, state, region
     * @returns {Array} of {String}s containing the timezones
     */
    getTimezones(): any[];
    /**
     * set language(s) for holiday names
     * @param {string|string[]} [language]
     * @returns {void}
     */
    setLanguages(language?: string | string[]): void;
    /**
     * get languages for selected country, state, region
     * @returns {Array} containing ISO 639-1 language shortcodes
     */
    getLanguages(): any[];
    /**
     * get default day off as weekday
     * @returns {String} weekday of day off
     */
    getDayOff(): string;
    /**
     * @private
     * @param {Number} year
     * @param {String} rule
     */
    /** @param {number} year @param {string} rule @returns {Holiday[]} */
    _dateByRule(year: number, rule: string): Holiday[];
    /**
     * translate holiday object `o` to a language
     * @private
     * @param {Holiday} o
     * @param {string[]} [langs] - languages for translation
     * @returns {Holiday} translated holiday object
     */
    private _translate;
}
