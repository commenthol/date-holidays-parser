/**
 * {
 *   0: 'sunday', ...
 *   sunday: 0, ...
 * }
 */
export const DAYS = (function () {
  const o = {}
  'sunday|monday|tuesday|wednesday|thursday|friday|saturday'
    .split('|')
    .forEach((name, idx) => {
      o[name] = idx
      o[idx] = name
    })
  return o
})()

function objectToString (o) {
  return Object.prototype.toString.call(o)
}

export function isObject (arg) {
  return typeof arg === 'object' && arg !== null
}

/**
 * @param {unknown} d
 * @returns {d is Date}
 */
export function isDate (d) {
  return isObject(d) && objectToString(d) === '[object Date]'
}

export const isNil = (v) => v === null || v === undefined

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
export function pad0 (number, len) {
  len = len || 2
  const str = Array(len).join('0') + number.toString()
  return str.substr(str.length - len, len)
}

/**
 * convert string to number
 * @private
 * @param {string|number} str
 * @return {number|undefined} converted number or undefined
 */
export function toNumber (str) {
  const num = parseInt(String(str), 10)
  if (!isNaN(num)) {
    return num
  }
}

/**
 * extract or set year
 * @private
 * @param {number|Date|string} year
 * @return {number|undefined} year
 */
export function toYear (year) {
  if (!year) {
    year = new Date().getFullYear()
  } else if (year instanceof Date) {
    year = year.getFullYear()
  } else if (typeof year === 'string') {
    year = toNumber(year)
  }
  return typeof year === 'number' ? year : undefined
}

/**
 * convert string to Date.
 * 2017        : year = 2017, month = 1, day = 1
 * '2017-07'   : year = 2017, month = 7, day = 1
 * '2017-07-03': year = 2017, month = 7, day = 3
 * @param {string|Date} [str]
 * @param {boolean} [isUTC] - return date in UTC
 * @return {Date|undefined}
 */
export function toDate (str, isUTC) {
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?.*$/.exec((str || '').toString())
  if (m) {
    m.shift()
    const [year, month, day] = m.map((num) => parseInt(num || '1', 10))
    if (isUTC) {
      return new Date(Date.UTC(year, month - 1, day))
    } else {
      return new Date(year, month - 1, day)
    }
  }
}
