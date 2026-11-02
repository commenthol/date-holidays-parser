/**
 * lodash compatible methods
 */

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

// deep merge adapted from deepmerge 4.3.1 (MIT, https://github.com/TehShrike/deepmerge),
// with the same behaviour as `deepmerge.all()`, so that the dependency can be dropped
const isMergeableObject = (value) => {
  if (!value || typeof value !== 'object') return false
  const tag = Object.prototype.toString.call(value)
  return tag !== '[object RegExp]' && tag !== '[object Date]'
}

const emptyTarget = (value) => Array.isArray(value) ? [] : {}

// own enumerable keys and symbols; `__proto__` is never copied
const getKeys = (object) => Object.keys(object)
  .concat(Object.getOwnPropertySymbols(object)
    .filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol)))
  .filter((key) => key !== '__proto__')

// `in` throws on primitives; they have no properties to merge into
const isOnObject = (object, key) => object !== null &&
  (typeof object === 'object' || typeof object === 'function') &&
  key in object

// properties inherited by `target` (e.g. `constructor`) are not overwritten
const isUnsafeProperty = (target, key) => isOnObject(target, key) &&
  !(Object.prototype.hasOwnProperty.call(target, key) &&
    Object.prototype.propertyIsEnumerable.call(target, key))

const clone = (value) => isMergeableObject(value)
  ? deepMerge(emptyTarget(value), value)
  : value

const mergeObject = (target, source) => {
  const destination = {}
  if (isMergeableObject(target)) {
    getKeys(target).forEach((key) => {
      destination[key] = clone(target[key])
    })
  }
  getKeys(source).forEach((key) => {
    if (isUnsafeProperty(target, key)) return
    if (isOnObject(target, key) && isMergeableObject(source[key])) {
      destination[key] = deepMerge(target[key], source[key])
    } else {
      destination[key] = clone(source[key])
    }
  })
  return destination
}

function deepMerge (target, source) {
  const sourceIsArray = Array.isArray(source)
  if (sourceIsArray !== Array.isArray(target)) return clone(source)
  if (sourceIsArray) return target.concat(source).map(clone)
  return mergeObject(target, source)
}

/**
 * deep merge `args` into a new object; same behaviour as `deepmerge.all(args)`
 * (arrays are concatenated, Date and RegExp are kept by reference)
 */
export const merge = (...args) => args.reduce((prev, next) => deepMerge(prev, next), {})

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
