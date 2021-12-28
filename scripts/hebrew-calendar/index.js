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
const out = { months: 13 }

const YEAR0 = 5730 - 1970 // difference between jewish and gregorian years

// loop over gregorian years
for (let y = 1969; y <= 2100; y++) {
  const iy = YEAR0 + y

  if (!out.year) {
    out.year = iy
  }
  const iyy = iy - out.year

  // loop over hebrew months; there mighth be an Adar2 month therefore loop to 13
  for (let im = 1; im <= 13; im++) {
    const g = new Hebcal.HDate(1, im, iy).greg()

    const gy = g.getFullYear()
    const gm = im - 1

    // console.log(g, gy, gm, [g.getMonth(), g.getDate(), iyy])

    if (!out[gy]) {
      out[gy] = []
    }

    const monthDateDiffYear = [g.getMonth(), g.getDate(), iyy]

    if (out[gy][gm]) {
      out[gy][gm] = out[gy][gm].concat(monthDateDiffYear)
    } else {
      out[gy][gm] = monthDateDiffYear
    }
  }
}

const final = '/*eslint-disable*/\nexport const calendar =' + JSON.stringify(out).replace(/"/g, '')
fs.writeFileSync(filename, final, 'utf8')

process.exit()
