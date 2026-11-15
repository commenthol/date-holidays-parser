/**
 * lodash compatible methods
 */

import deepmerge from 'deepmerge'

const PROTO_KEYS = ['__proto__', 'constructor', 'prototype']

/**
 * get value at `keys` from `object`
 * @param {any} obj
 * @param {string|string[]} [keys]
 * @param {any} [def]
 * @returns {any}
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
export const get = (obj, keys = [], def) => {
  let tmp = obj
  if (typeof keys === 'string') keys = keys.split('.')
  for (const key of keys) {
    if (tmp && tmp[key]) {
      tmp = tmp[key]
    } else {
      return def
    }
  }
  return tmp
}

/**
 * set `value` at `keys` from `object`
 * @param {any} obj
 * @param {string[]} keys
 * @param {any} value
 * @returns {any}
 * @example
 * set({a: {b: {c: 2}}}, ['a', 'b', 'c'], 3)
 */
export const set = (obj, keys = [], value) => {
  let key
  let ref
  let tmp = obj
  // prevent prototype pollution
  if (PROTO_KEYS.includes(keys[0])) {
    return obj
  }
  for (key of keys) {
    ref = tmp
    const type = Object.prototype.toString.call(tmp[key])
    if (type !== '[object Object]' && type !== '[object Array]') {
      tmp[key] = {}
    }
    tmp = tmp[key]
  }
  if (Array.isArray(ref[key])) {
    ref[key].push(value)
  } else {
    ref[key] = value
  }
  return obj
}

/**
 * omit `object` properties `props`
 * @param {object} object
 * @param {string[]} [props]
 * @returns {object}
 */
export const omit = (object, props = []) =>
  Object.keys(object)
    .filter((p) => !~props.indexOf(p))
    .reduce((o, p) => {
      p in object && (o[p] = object[p])
      return o
    }, {})

/**
 * @param {...object} args
 * @returns {object}
 */
export const merge = (...args) => deepmerge.all(args)

/**
 * @param {string|number} num
 * @param {number} [def]
 * @returns {number}
 */
export const toNumber = (num, def) => {
  const _num = Number(num)
  return isNaN(_num) ? def : _num
}

export default {
  get,
  set,
  omit,
  merge
}
