import { julian, planetposition, solstice } from 'astronomia'
import CalDate from 'caldate'
import { DateTime } from 'luxon'
import CalEvent from './CalEvent.js'
import { vsop87Bearth } from './vsop87Bearth.js'


const earth = new planetposition.Planet(vsop87Bearth)

export default class Equinox extends CalEvent {
    /**
     * @param {object} [opts]
     * @param {string} opts.season - type of season (spring|summer|autumn|winter)
     * @param {number|string} opts.offset - offset in days
     */
    constructor(opts) {
        opts = opts || {}
        super(opts)

        this._season = opts.season
        this._timezone = opts.timezone || 'GMT'
    }

    inYear(year) {
        let jde
        switch (this._season) {
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
        let date
        if (/^[+-]\d{2}:\d{2}?$/.test(this._timezone)) {
            // for '+08:00' formats
            date = DateTime.fromISO(str, { setZone: true })
        } else {
            // for 'Asia/Shanghai' formats
            date = DateTime.fromISO(str, { zone: this._timezone }) // move to timezone
        }

        const floorDate = {
            year: year,
            month: date.month,
            day: date.day,
        }

        const d = new CalDate(floorDate).setOffset(this.offset)
        this.dates.push(d)
        return this
    }
}
