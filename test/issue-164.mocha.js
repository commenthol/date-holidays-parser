/* global describe, it */

'use strict'

const assert = require('assert')
const Holidays = require('../src')

const fixture = {
  holidays: {
    TEST: {
      names: {
        en: 'test'
      },
      dayoff: 'sunday',
      zones: [
        'Europe/Paris'
      ],
      langs: [
        'en'
      ],
      days: {
        'sunday before 06-01': {
          name: {
            en: 'observance'
          },
          type: 'observance'
        },
        'easter 49': {
          name: {
            en: 'public'
          }
        }
      }
    }
  }
}

describe('#issue-164', function () {
  it('isHolidays shall return list of possible holidays', function () {
    const hd = new Holidays(fixture, 'TEST')
    const is = hd.isHoliday(new Date('2020-05-31T12:00:00Z'))
    assert.deepStrictEqual(is, [{
      date: '2020-05-31 00:00:00',
      start: new Date('2020-05-30T22:00:00.000Z'),
      end: new Date('2020-05-31T22:00:00.000Z'),
      name: 'observance',
      type: 'observance'
    },
    {
      date: '2020-05-31 00:00:00',
      start: new Date('2020-05-30T22:00:00.000Z'),
      end: new Date('2020-05-31T22:00:00.000Z'),
      name: 'public',
      type: 'public'
    }])
  })
  it('isHolidays shall return list if single event matches', function () {
    const hd = new Holidays(fixture, 'TEST')
    const is = hd.isHoliday(new Date('2019-06-08T22:00:00.000Z'))
    assert.deepStrictEqual(is, [{
      date: '2019-06-09 00:00:00',
      start: new Date('2019-06-08T22:00:00.000Z'),
      end: new Date('2019-06-09T22:00:00.000Z'),
      name: 'public',
      type: 'public'
    }])
  })
})
