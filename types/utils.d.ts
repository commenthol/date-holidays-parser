/**
 * lodash compatible methods
 */
/**
 * get value at `keys` from `object`
 * @param {any} obj
 * @param {string|string[]} [keys]
 * @param {any} [def]
 * @returns {any}
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
export declare const get: (obj: any, keys?: string | string[], def?: any) => any;
/**
 * set `value` at `keys` from `object`
 * @param {any} obj
 * @param {string[]} keys
 * @param {any} value
 * @returns {any}
 * @example
 * set({a: {b: {c: 2}}}, ['a', 'b', 'c'], 3)
 */
export declare const set: (obj: any, keys: string[], value: any) => any;
/**
 * omit `object` properties `props`
 * @param {object} object
 * @param {string[]} [props]
 * @returns {object}
 */
export declare const omit: (object: object, props?: string[]) => object;
/**
 * @param {...object} args
 * @returns {object}
 */
export declare const merge: (...args: object[]) => object;
/**
 * @param {string|number} num
 * @param {number} [def]
 * @returns {number}
 */
export declare const toNumber: (num: string | number, def?: number) => number;
declare const _default: {
    get: typeof get;
    set: typeof set;
    omit: typeof omit;
    merge: typeof merge;
};
export default _default;
