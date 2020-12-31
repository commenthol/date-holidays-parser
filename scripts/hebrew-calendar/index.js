'use strict'

/**
 * provides a mapping of hebrew calendar dates per gregorian year.
 * ```js
 * // gregorian year: [ jewish months ]
 * // each 1st day of an jewish month is expressed with a gregorian
 * // month `M` and date `D` and the hebrew year `iY`
 * { year: {number}, <year>: [[M,D,iY], ... [M,D,iY,M,D,iY]], <year + 1>: {} ... }
 * ```
 */

const fs = require('fs')
const path = require('path')
const Hebcal = require('hebcal')

const filename = path.resolve(__dirname, '../../src/internal/hebrew-calendar.js')
const out = {}

for (let y = 1969; y <= 2100; y++) {
  const yd = 5730 - 1970 // difference between jewish and gregorian years
  const iy = yd + y

  if (!out.year) {
    out.year = iy
  }
  const iyy = iy - out.year

  for (let im = 1; im <= 12; im++) {
    const m = new Hebcal.HDate(1, im, iy).greg()

    const my = m.getFullYear()
    const mm = im - 1

    if (!out[my]) {
      out[my] = []
    }

    if (out[my][mm]) {
      // ~ console.log('//', my, mm, m.getMonth(), m.getDate())
      out[my][mm] = out[my][mm].concat([m.getMonth(), m.getDate(), iyy])
    } else {
      out[my][mm] = [m.getMonth(), m.getDate(), iyy]
    }
  }
}

const final = '/*eslint-disable*/\nmodule.exports=' + JSON.stringify(out).replace(/"/g, '')
fs.writeFileSync(filename, final, 'utf8')

process.exit()
