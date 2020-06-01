/* global describe, it */

'use strict'

const assert = require('assert')
const Holidays = require('../src')

const fixture = {
  holidays: {
    IE: {
      names: {
        en: 'Ireland'
      },
      dayoff: 'sunday',
      zones: [
        'Europe/Dublin'
      ],
      langs: [
        'en'
      ],
      days: {
        '03-17': {
          name: {
            en: 'St. Patrick’s Day'
          },
          type: 'public'
        },
        '03-17 if saturday then next monday if sunday then next monday': {
          name: {
            en: 'St. Patrick’s Day'
          },
          type: 'bank'
        }
      }
    }
  }
}

describe('#issue-ruletypes', function () {
  it('should return simple rule if Friday', function () {
    const hd = new Holidays(fixture, 'IE')
    const res = hd.getHolidays(2017)
    assert.deepStrictEqual(res, [{ // Friday
      date: '2017-03-17 00:00:00',
      start: new Date('2017-03-17T00:00:00.000Z'),
      end: new Date('2017-03-18T00:00:00.000Z'),
      name: 'St. Patrick’s Day',
      rule: '03-17',
      type: 'public'
    }])
  })

  it('should return both rules if Saturday', function () {
    const hd = new Holidays(fixture, 'IE')
    const res = hd.getHolidays(2018)
    assert.deepStrictEqual(res, [
      {
        date: '2018-03-17 00:00:00',
        start: new Date('2018-03-17T00:00:00.000Z'),
        end: new Date('2018-03-18T00:00:00.000Z'),
        name: 'St. Patrick’s Day',
        rule: '03-17',
        type: 'public'
      },
      {
        date: '2018-03-19 00:00:00',
        start: new Date('2018-03-19T00:00:00.000Z'),
        end: new Date('2018-03-20T00:00:00.000Z'),
        name: 'St. Patrick’s Day',
        rule: '03-17 if saturday then next monday if sunday then next monday',
        type: 'bank'
      }
    ])
  })

  it('should return both rules if Sunday', function () {
    const hd = new Holidays(fixture, 'IE')
    const res = hd.getHolidays(2019)
    assert.deepStrictEqual(res, [
      {
        date: '2019-03-17 00:00:00',
        start: new Date('2019-03-17T00:00:00.000Z'),
        end: new Date('2019-03-18T00:00:00.000Z'),
        name: 'St. Patrick’s Day',
        rule: '03-17',
        type: 'public'
      },
      {
        date: '2019-03-18 00:00:00',
        start: new Date('2019-03-18T00:00:00.000Z'),
        end: new Date('2019-03-19T00:00:00.000Z'),
        name: 'St. Patrick’s Day',
        rule: '03-17 if saturday then next monday if sunday then next monday',
        type: 'bank'
      }
    ])
  })
})
