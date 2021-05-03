/**
 * lodash compatible methods
 */

import deepmerge from 'deepmerge'

/**
 * get value at `keys` from `object`
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
export const get = (obj, keys = [], def) => {
  let o = obj
  if (typeof keys === 'string') keys = keys.split('.')
  for (const key of keys) {
    if (o && o[key]) { o = o[key] } else { return def }
  }
  return o
}

/**
 * set `value` at `keys` from `object`
 * @example
 * set({a: {b: {c: 2}}}, ['a', 'b', 'c'], 3)
 */
export const set = (obj, keys = [], value) => {
  let key
  let ref
  let o = obj
  for (key of keys) {
    ref = o
    if (toString.call(o[key]) !== '[object Object]') o[key] = {}
    o = o[key]
  }
  ref[key] = value
  return obj
}

/**
 * omit `object` properties `props`
 */
export const omit = (object, props = []) => Object.keys(object)
  .filter(p => !~props.indexOf(p))
  .reduce((o, p) => {
    p in object && (o[p] = object[p])
    return o
  }, {})

export const merge = (...args) => deepmerge.all(args)

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
