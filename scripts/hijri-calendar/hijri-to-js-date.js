// taken from https://stackoverflow.com/questions/71222556/how-to-convert-any-of-the-5-islamic-hijri-calendars-dates-to-any-of-18-world
// watch the temporal ECMAscript proposal which will make much of this obsolete

const formatters = {}
/**********************************************************************************
* @purpose   : Converts Islamic (Hijri) Date to other Calendars' Dates.
*              Handles all 5 Islamic Calendar Types.
*              Uses the 'JS Calendar Conversion by Target Approximation' Method.
*
* @version   : 1.00
* @author    : Mohsen Alyafei
* @date      : 21 Feb 2022
* @licence   : MIT
* @param {number} year Hijri year
* @param {number} month hijri month (1 to 12) note: months is standard 1 based
* @param {number} day hijri day (1 to 29/30)
* @param {('islamic-umalqura'|'islamic-civil'|'islamic-tbla'|'islamic-rgsa'|'islamic')} [fromCalendar] Specifies the the type of input Islamic Calendar. default 'islamic-umalqura'
* @returns   : Return the JavaScript Date object corresponding to the given parameters
*/
module.exports = function hijriToJSDate (year, month, day, fromCalendar) {
  fromCalendar = 'en-u-ca-' + (fromCalendar || 'islamic-umalqura')
  const dFormat = formatters[fromCalendar] || (formatters[fromCalendar] = new Intl.DateTimeFormat(fromCalendar, { dateStyle: 'short', timeZone: 'UTC' }))
  let gD = new Date(Date.UTC(2000, 0, 1))
  gD = new Date(gD.setUTCDate(gD.getUTCDate() +
        ~~(227022 + (year + (month - 1) / 12 + day / 354) * 354.367)))
  const gY = gD.getUTCFullYear() - 2000
  gD = new Date(Date.UTC(gY, gD.getUTCMonth(), gD.getUTCDate()))
  let [iM, iD, iY] = dFormat.format(gD).split('/').map(n => parseInt(n, 10))
  gD = new Date(gD.setUTCDate(gD.getUTCDate() +
        ~~(year * 354 + month * 29.53 + day - (iY * 354 + iM * 29.53 + iD * 1) - 2)))
  for (let i = 0; i < 4; ++i) {
    [iM, iD, iY] = dFormat.format(gD).split('/').map(n => parseInt(n, 10))
    if (iD === day && iM === month && iY === year) return gD
    gD.setUTCDate(gD.getUTCDate() + 1)
  }
  throw new Error('Invalid ' + fromCalendar + ' date!')
}
//* *********************************************************************************
