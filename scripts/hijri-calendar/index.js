/**
 * provides a mapping of islamic calendar dates per gregorian year
 * the islamic calender year being shorter than the gregorian year the
 * start of an islamic month may show up twice with a gregorian date
 * ```js
 * // gregorian year: [ islamic months ]
 * // each 1st day of an islamic month is expressed with a gregorian
 * // month `M` and date `D` and the islamic year `iY`
 * { year: {number}, <year>: [[M,D,iY], ... [M,D,iY,M,D,iY]], <year + 1>: {} ... }
 * ```
 * > Note: The library moment-hijri currently only provides dates between
 * > 1356/1/1 (1937-03-14) and 1500/12/30 (2077-11-16) which should be
 * > sufficient for our needs
 */

const fs = require('fs')
const path = require('path')
const moment = require('moment-hijri')

// 1 Muharram 1389 is at 1969-03-19 in gregorian year
const START_YEAR = 1389

const filename = path.resolve(__dirname, '../../src/internal/hijri-calendar.js')
const newYear = year => moment(`${year}-01-01 00:00:00`)

const out = {
  year: START_YEAR
}

const endYear = newYear(2077).iYear()

for (let iy = START_YEAR; iy <= endYear; iy++) {
  for (let im = 1; im <= 12; im++) {
    const m = moment(iy + '/' + im + '/1', 'iYYYY/iM/iD')

    const iyy = iy - out.year

    const gy = m.year()
    const iim = m.iMonth()

    if (!out[gy]) {
      out[gy] = []
    }

    const monthDateDiffYear = [m.month(), m.date(), iyy]

    if (out[gy][iim]) {
      out[gy][iim] = out[gy][iim].concat(monthDateDiffYear)
    } else {
      out[gy][iim] = monthDateDiffYear
    }
  }
}

const final = '/*eslint-disable*/\nexport const calendar =' + JSON.stringify(out).replace(/"/g, '')
fs.writeFileSync(filename, final, 'utf8')
