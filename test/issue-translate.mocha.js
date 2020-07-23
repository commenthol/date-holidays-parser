/* global describe, it */

'use strict'

const assert = require('assert')
const Holidays = require('../src')

const fixtures = {
  holidays: require('./fixtures/holidays.json')
}

describe('#issue-translate', function () {
  it('should translate swiss state names by spoken lang', function () {
    const exp = {
      ZH: 'Kanton Zürich',
      BE: 'Kanton Bern',
      LU: 'Kanton Luzern',
      UR: 'Kanton Uri',
      SZ: 'Kanton Schwyz',
      OW: 'Kanton Obwalden',
      NW: 'Kanton Nidwalden',
      GL: 'Kanton Glarus',
      ZG: 'Kanton Zug',
      FR: 'Canton de Fribourg',
      SO: 'Kanton Solothurn',
      BS: 'Kanton Basel-Stadt',
      BL: 'Kanton Basel-Landschaft',
      SH: 'Kanton Schaffhausen',
      AR: 'Kanton Appenzell Ausserrhoden',
      AI: 'Kanton Appenzell Innerrhoden',
      SG: 'Kanton St. Gallen',
      GR: 'Kanton Graubünden',
      AG: 'Kanton Aargau',
      TG: 'Kanton Thurgau',
      TI: 'Canton Ticino',
      VD: 'Canton de Vaud',
      VS: 'Canton du Valais',
      NE: 'Canton de Neuchâtel',
      GE: 'Canton de Genève',
      JU: 'Canton du Jura'
    }
    const hd = new Holidays(fixtures.holidays)
    const res = hd.getStates('ch')
    assert.deepStrictEqual(res, exp)
  })

  it('should translate holiday names by default lang of state for Ticino in italian', function () {
    const hd = new Holidays(fixtures.holidays, 'ch-ti')
    const res = hd.getHolidays(2018).map(i => i.name)
    assert.ok(res.includes('Epifania'))
    assert.ok(res.includes('Santo Stefano'))
  })

  it('should translate holiday names by subtag "de-ch"', function () {
    const hd = new Holidays(fixtures.holidays, 'ch-ur')
    const res = hd.getHolidays(2018).map(i => i.name)
    assert.ok(res.includes('Dreikönigstag'))
    assert.ok(res.includes('Stephanstag'))
  })

  it('should translate holiday names by subtag "de-ch" for "Graubünden"', function () {
    const hd = new Holidays(fixtures.holidays, 'ch-gr')
    const res = hd.getHolidays(2018, 'de-ch').map(i => i.name)
    assert.ok(res.includes('Dreikönigstag'))
    assert.ok(res.includes('Stephanstag'))
  })

  it('should get country name by spoken language', function () {
    const hd = new Holidays(fixtures.holidays)
    const res = hd.getCountries()
    assert.strictEqual(res.AE, 'دولة الإمارات العربية المتحدة')
  })
})
