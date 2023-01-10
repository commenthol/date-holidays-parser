/**
 * Follw https://github.com/tc39/proposal-temporal/issues/1450 for when this is superseded
 * provides a mapping of islamic calendar dates per gregorian year
 * the islamic calender year being shorter than the gregorian year the
 * start of an islamic month may show up twice with a gregorian date
 * ```js
 * // gregorian year: [ islamic months ]
 * // each 1st day of an islamic month is expressed with a gregorian
 * // month `M` and date `D` and the islamic year `iY`
 * { year: {number}, <year>: [[M,D,iY], ... [M,D,iY,M,D,iY]], <year + 1>: {} ... }
 * ```
 */
const hijriToJSDate = require('./hijri-to-js-date')
const fs = require('fs')
const path = require('path')

// 1 Muharram 1389 is at 1969-03-19 in gregorian year
// to double check start dates for each month of 1389, go to https://hijri.habibur.com/1389/
const START_YEAR = 1389

const filename = path.resolve(__dirname, '../../src/internal/hijri-calendar.js')
const newYear = year => new Date(`${year}-01-01 00:00:00Z`)

const out = new Map([['year', START_YEAR]])
const calendar = 'islamic-umalqura'
const dFormat = new Intl.DateTimeFormat('en-u-ca-' + calendar, { dateStyle: 'short', timeZone: 'UTC' })
const endYear = parseInt(dFormat.format(newYear(2077)).split('/')[2])

for (let iy = START_YEAR; iy <= endYear; iy++) {
  for (let im = 1; im <= 12; im++) {
    const d = hijriToJSDate(iy, im, 1, calendar)
    const iyy = iy - START_YEAR

    const gy = d.getUTCFullYear()
    const iim = im - 1

    if (!out.has(gy)) {
      out.set(gy, [])
    }

    const monthDateDiffYear = [d.getUTCMonth(), d.getUTCDate(), iyy]

    if (out.get(gy)[iim]) {
      out.get(gy)[iim] = out.get(gy)[iim].concat(monthDateDiffYear)
    } else {
      out.get(gy)[iim] = monthDateDiffYear
    }
  }
}

const final = '/*eslint-disable*/\nexport const calendar =' + JSON.stringify(Object.fromEntries(out.entries())).replace(/"/g, '')
fs.writeFileSync(filename, final, 'utf8')
