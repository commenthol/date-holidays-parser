/* global describe, it */

'use strict'

const assert = require('assert')
const Holidays = require('../src')

const fixture = {
  holidays: {
    AU: {
      names: {
        en: 'Australia'
      },
      dayoff: 'sunday',
      langs: [
        'en'
      ],
      zones: [
        'Australia/Sydney',
        'Australia/Lord_Howe',
        'Antarctica/Macquarie',
        'Australia/Hobart',
        'Australia/Currie',
        'Australia/Melbourne',
        'Australia/Broken_Hill',
        'Australia/Brisbane',
        'Australia/Lindeman',
        'Australia/Adelaide',
        'Australia/Darwin',
        'Australia/Perth',
        'Australia/Eucla'
      ],
      days: {
        '01-01 and if saturday,sunday then next monday': {
          substitute: true,
          name: 'New Year'
        },
        '12-31': {
          name: 'New Years Eve',
          type: 'observance'
        }
      }
    }
  }
}

describe('#issue-timezone', function () {
  it('should return New Year for 2017 in Australia/Sydney', function () {
    const hd = new Holidays(fixture, 'AU')
    const date = new Date('2016-12-31T13:00:00.000Z')
    const res = hd.isHoliday(date)
    assert.deepStrictEqual(res, {
      date: '2017-01-01 00:00:00',
      start: new Date('2016-12-31T13:00:00.000Z'),
      end: new Date('2017-01-01T13:00:00.000Z'),
      name: 'New Year',
      type: 'public'
    })
  })

  it('should return New Years Eve for 2016 in Australia/Sydney', function () {
    const hd = new Holidays(fixture, 'AU')
    const date = new Date('2016-12-31T12:59:59Z')
    const res = hd.isHoliday(date)
    assert.deepStrictEqual(res, {
      date: '2016-12-31 00:00:00',
      start: new Date('2016-12-30T13:00:00.000Z'),
      end: new Date('2016-12-31T13:00:00.000Z'),
      name: 'New Years Eve',
      type: 'observance'
    })
  })
})
