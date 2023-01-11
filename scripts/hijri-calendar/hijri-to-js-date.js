// taken from https://stackoverflow.com/questions/71222556/how-to-convert-any-of-the-5-islamic-hijri-calendars-dates-to-any-of-18-world
// watch the temporal ECMAscript proposal which will make much of this obsolete - https://github.com/tc39/proposal-temporal

const formatters = {}
function getFormatter (calendar) {
  const locale = 'en-u-ca-' + calendar
  let returnFormatter = formatters[locale]
  if (returnFormatter) return returnFormatter
  const support = ['islamic-umalqura', 'islamic-civil', 'islamic-tbla', 'islamic-rgsa', 'islamic']
  if (!support.includes(calendar)) throw new Error(`calendar must be one of '${support.join("', '")}'`)
  if (!Intl || typeof Intl.DateTimeFormat !== 'function') throw new Error('Intl.DateTimeFormat is not available in this environment')
  try {
    returnFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeZone: 'UTC' })
  } catch (err) {
    throw new Error(`Intl.DateTimeFormat threw an error, usually because locale '${locale}' is unsupported`, { cause: err })
  }
  return (formatters[locale] = returnFormatter)
}
/**********************************************************************************
* @purpose   : Converts Islamic (Hijri) Date to a Javascript Date.
*              Handles all 5 Islamic Calendar Types.
*              Uses the 'JS Calendar Conversion by Target Approximation' Method.
* @warning     Uses Intl.DateTimeFormat which is not supported on android. Most polyfills only work with gregorian calendars, in which case this script will not work.
* @author    : Mohsen Alyafei (Feb 2022)
* @licence   : MIT
* @param {number} year Hijri year
* @param {number} month Hijri month (1 to 12) note: months is standard 1 based
* @param {number} day Hijri day (1 to 29/30)
* @param {('islamic-umalqura'|'islamic-civil'|'islamic-tbla'|'islamic-rgsa'|'islamic')} [fromCalendar] Specifies the the type of input Islamic Calendar. default 'islamic-umalqura'
* @returns A new JavaScript Date at UTC midnight corresponding to the provided Hijri year, month and day
*/
module.exports = function hijriToJSDate (year, month, day, fromCalendar) {
  'use strict'
  const dFormat = getFormatter(fromCalendar)
  let gD = new Date(Date.UTC(2000, 0, 1))
  gD.setUTCDate(gD.getUTCDate() + Math.trunc(227022 + (year + (month - 1) / 12 + day / 354) * 354.367))
  const gY = gD.getUTCFullYear() - 2000
  gD = new Date(Date.UTC(gY, gD.getUTCMonth(), gD.getUTCDate()))
  let [iM, iD, iY] = dFormat.format(gD).split('/').map(n => parseInt(n, 10))
  gD.setUTCDate(gD.getUTCDate() + Math.trunc(year * 354 + month * 29.53 + day - (iY * 354 + iM * 29.53 + iD * 1) - 2))
  for (let i = 0; i < 4; ++i) {
    [iM, iD, iY] = dFormat.format(gD).split('/').map(n => parseInt(n, 10))
    if (iD === day && iM === month && iY === year) return gD
    gD.setUTCDate(gD.getUTCDate() + 1)
  }
  throw new Error('Invalid ' + fromCalendar + ' date!')
}
