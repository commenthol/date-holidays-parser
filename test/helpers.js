'use strict'

const {pad0, toTimezone} = require('../src/internal/utils')

const toIso = exports.toIso = function toIso (date) {
  date = new Date(date)
  var days = 'sun,mon,tue,wed,thu,fri,sat'.split(',')

  var y = pad0(date.getFullYear(), 4)
  var m = pad0(date.getMonth() + 1, 2)
  var d = pad0(date.getDate(), 2)
  var H = pad0(date.getHours(), 2)
  var M = pad0(date.getMinutes(), 2)
  var t = days[date.getDay()]

  return t + ' ' + y + '-' + m + '-' + d + ' ' + H + ':' + M
}

exports.fixResult = function fixResult (arr) {
  return arr.map((item) => {
    return Object.assign({}, item, {
      start: toIso(item.start),
      end: toIso(item.end)
    })
  })
}

exports.moveToTimezone = function (date, timezone) {
  if (!timezone) {
    return date
  }
  return toTimezone(date, timezone).toString()
}

function localDate (str) {
  var m = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):?(\d+)?$/.exec(str)
  if (m) {
    m.shift()
    m = m.map((str) => parseInt(str || 0, 10))
    var d = new Date(m[0], m[1] - 1, m[2], m[3], m[4], m[5])
    return d
  }
}

exports.localDate = localDate

// console.log(localDate('2017-09-09 01:02'))
// console.log(localDate('2017-09-09 01:02:03'))
