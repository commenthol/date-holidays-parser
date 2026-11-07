/**
 * {
 *   0: 'sunday', ...
 *   sunday: 0, ...
 * }
 */
export declare const DAYS: {};
export declare function isObject(arg: any): boolean;
/**
 * @param {unknown} d
 * @returns {d is Date}
 */
export declare function isDate(d: unknown): d is Date;
export declare const isNil: (v: any) => boolean;
/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
export declare function pad0(number: number, len?: number): string;
/**
 * convert string to number
 * @private
 * @param {string|number} str
 * @return {number|undefined} converted number or undefined
 */
export declare function toNumber(str: string | number): number | undefined;
/**
 * extract or set year
 * @private
 * @param {number|Date|string} year
 * @return {number|undefined} year
 */
export declare function toYear(year: number | Date | string): number | undefined;
/**
 * convert string to Date.
 * 2017        : year = 2017, month = 1, day = 1
 * '2017-07'   : year = 2017, month = 7, day = 1
 * '2017-07-03': year = 2017, month = 7, day = 3
 * @param {string|Date} [str]
 * @param {boolean} [isUTC] - return date in UTC
 * @return {Date|undefined}
 */
export declare function toDate(str?: string | Date, isUTC?: boolean): Date | undefined;
