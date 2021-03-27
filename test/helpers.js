import moment from 'moment-timezone'
import { pad0 } from '../src/internal/utils.js'

export function toIso (date) {
  const days = 'sun,mon,tue,wed,thu,fri,sat'.split(',')

  const y = pad0(date.getFullYear(), 4)
  const m = pad0(date.getMonth() + 1, 2)
  const d = pad0(date.getDate(), 2)
  const H = pad0(date.getHours(), 2)
  const M = pad0(date.getMinutes(), 2)
  const t = days[date.getDay()]

  return t + ' ' + y + '-' + m + '-' + d + ' ' + H + ':' + M
}

export function fixResult (arr) {
  return arr.map((item) => {
    return Object.assign({}, item, {
      start: toIso(item.start),
      end: toIso(item.end)
    })
  })
}

function toString (date) {
  const year = pad0(date.getFullYear(), 4)
  const month = pad0(date.getMonth() + 1)
  const day = pad0(date.getDate())
  const hours = pad0(date.getHours())
  const minutes = pad0(date.getMinutes())
  const seconds = pad0(date.getSeconds())

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

export function moveToTimezone (date, timezone) {
  if (!timezone) {
    return date
  }
  return new Date(moment.tz(toString(date), timezone).format())
}

export function localDate (str) {
  let m = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):?(\d+)?$/.exec(str)
  if (m) {
    m.shift()
    m = m.map((str) => parseInt(str || 0, 10))
    const d = new Date(m[0], m[1] - 1, m[2], m[3], m[4], m[5])
    return d
  }
}

// console.log(localDate('2017-09-09 01:02'))
// console.log(localDate('2017-09-09 01:02:03'))
