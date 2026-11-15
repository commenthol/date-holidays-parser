/** @template TParsed @typedef {import('../types.js').CalendarPlugin<TParsed>} CalendarPlugin */

import { solstice, julian, planetposition } from 'astronomia'
import CalDate from 'caldate'
import { vsop87Bearth } from '../vsop87Bearth.js'

const earth = new planetposition.Planet(vsop87Bearth)

/** @type {CalendarPlugin<{ season: string, timezone: string }>} */
export const EquinoxCalendarPlugin = {
  fnNames: ['equinox'],

  parse(remainingRule) {
    const match =
      /^([Mm]arch|[Jj]une|[Ss]eptember|[Dd]ecember) (?:equinox|solstice)(?: in ([^\s]*|[+-]\d{2}:\d{2}))?/.exec(
        remainingRule
      )
    if (!match) return { kind: 'no-match' }
    return {
      kind: 'match',
      consumed: match[0].length,
      value: { season: match[1].toLowerCase(), timezone: match[2] || 'GMT' }
    }
  },

  calculate(parsed, year, context) {
    let jde
    switch (parsed.season) {
      case 'march': {
        jde = solstice.march2(year, earth)
        break
      }
      case 'june': {
        jde = solstice.june2(year, earth)
        break
      }
      case 'september': {
        jde = solstice.september2(year, earth)
        break
      }
      case 'december': {
        jde = solstice.december2(year, earth)
        break
      }
    }

    const str = new julian.Calendar().fromJDE(jde).toDate().toISOString()
    const date = new CalDate().fromTimezone(
      new Date(str),
      parsed.timezone,
      context.timezoneAdapter
    )
    return [{ year, month: date.month, day: date.day }]
  }
}
