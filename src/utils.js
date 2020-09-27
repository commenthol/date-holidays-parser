/**
 * lodash compatible methods
 */

const deepmerge = require('deepmerge').all

/**
 * get value at `keys` from `object`
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
const get = (obj, keys = [], def) => {
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
const set = (obj, keys = [], value) => {
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
const omit = (object, props = []) => Object.keys(object)
  .filter(p => !~props.indexOf(p))
  .reduce((o, p) => {
    p in object && (o[p] = object[p])
    return o
  }, {})

const merge = (...args) => deepmerge(args)

module.exports = {
  get,
  set,
  omit,
  merge
}
