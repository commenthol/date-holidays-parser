import assert from 'assert'
import moment from 'moment-timezone'
import Holidays from './support.js'
import CoreHolidays from '../src/index.js'
import allPlugins from 'date-holidays-parser/plugins'
import { EasterCalendarPlugin } from 'date-holidays-parser/plugins/EasterCalendarPlugin'
import fixtures from './fixtures/index.cjs'

describe('#CalendarPlugin', function () {
  it('calculates an application-supplied calendar through a Holidays instance', function () {
    let calculationTimezone
    const plugin = {
      fnNames: ['festival', 'festival-alias'],
      parse(remainingRule) {
        const match = /^(festival|festival-alias) (\d{1,2})-(\d{1,2})/.exec(
          remainingRule
        )
        if (!match) return { kind: 'no-match' }
        return {
          kind: 'match',
          consumed: match[0].length,
          value: { month: Number(match[2]), day: Number(match[3]) }
        }
      },
      calculate(parsed, year, context) {
        calculationTimezone = context.timezone
        return [{ year, month: parsed.month, day: parsed.day }]
      }
    }
    const hd = new Holidays(fixtures.custom, 'CUSTOM', {
      timezone: 'UTC',
      plugins: [plugin]
    })

    assert.strictEqual(
      hd.setHoliday('festival 3-11', {
        type: 'public',
        name: { en: 'Festival Day' }
      }),
      true
    )

    assert.strictEqual(
      hd.setHoliday('festival-alias 3-12', {
        type: 'public',
        name: { en: 'Festival Alias' }
      }),
      true
    )

    const holidays = hd.getHolidays(2024, 'en')
    const holiday = holidays.find(({ rule }) => rule === 'festival 3-11')
    const aliasHoliday = holidays.find(
      ({ rule }) => rule === 'festival-alias 3-12'
    )
    assert.strictEqual(holiday.date, '2024-03-11 00:00:00')
    assert.strictEqual(holiday.end.toISOString(), '2024-03-12T00:00:00.000Z')
    assert.strictEqual(aliasHoliday.date, '2024-03-12 00:00:00')
    assert.strictEqual(calculationTimezone, 'UTC')

    hd.setTimezone('Pacific/Auckland')
    hd.getHolidays(2024, 'en')
    assert.strictEqual(calculationTimezone, 'Pacific/Auckland')
  })

  it('passes the most specific location coordinates to plugins after init', function () {
    const country = { latitude: 10, longitude: 20 }
    const state = { latitude: 0, longitude: -30 }
    const region = { latitude: -40, longitude: 50 }
    const directRegion = { latitude: 60, longitude: 0 }
    const data = {
      holidays: {
        XX: {
          coordinates: country,
          days: { 'location-calendar': { name: { en: 'Location' } } },
          states: {
            AA: {
              coordinates: state,
              regions: { ONE: { coordinates: region }, TWO: {} }
            },
            BB: {}
          }
        },
        ZZ: {
          coordinates: country,
          days: { 'location-calendar': { name: { en: 'Location' } } },
          regions: { DIRECT: { coordinates: directRegion }, EMPTY: {} }
        },
        YY: { days: { 'location-calendar': { name: { en: 'Location' } } } }
      },
      names: {}
    }
    const received = []
    const plugin = {
      fnNames: ['location-calendar'],
      parse(rule) {
        return rule === 'location-calendar'
          ? { kind: 'match', consumed: rule.length, value: null }
          : { kind: 'no-match' }
      },
      calculate(_parsed, year, context) {
        received.push(context.coordinates)
        return [{ year, month: 1, day: context.coordinates ? 2 : 1 }]
      }
    }
    const hd = new CoreHolidays(data, 'XX', {
      timezone: 'UTC',
      plugins: [plugin]
    })
    const check = (expected) => {
      received.length = 0
      const holidays = hd.getHolidays(2024)
      assert.strictEqual(holidays.length, 1)
      assert.strictEqual(
        holidays[0].date,
        expected ? '2024-01-02 00:00:00' : '2024-01-01 00:00:00'
      )
      assert.strictEqual(received.length, 3)
      received.forEach((coordinates) =>
        assert.deepStrictEqual(coordinates, expected)
      )
    }

    check(country)
    hd.setHoliday('location-calendar', { type: 'public', name: 'Custom' })
    check(country)
    hd.init('XX', 'AA')
    check(state)
    hd.init('xx.aa.one')
    check(region)
    hd.init('XX', 'AA', 'TWO')
    check(state)
    hd.init('XX', 'BB')
    check(country)
    hd.init('ZZ', 'DIRECT')
    check(directRegion)
    hd.init('ZZ', 'EMPTY')
    check(country)
    hd.init('YY')
    check(undefined)
    hd.setHoliday('location-calendar', { type: 'public', name: 'Custom' })
    check(undefined)
    hd.init('XX', {
      data: {
        ...data,
        holidays: { XX: { ...data.holidays.ZZ, coordinates: directRegion } }
      }
    })
    check(directRegion)
  })

  it('enables built-in plugins only when explicitly selected', function () {
    const previousError = console.error
    const easterOptions = () => ({ type: 'public', name: { en: 'Easter' } })
    let hd
    try {
      console.error = () => {}
      hd = new CoreHolidays(fixtures.custom, 'CUSTOM', { timezone: 'UTC' })
      assert.strictEqual(hd.setHoliday('easter -3', easterOptions()), false)
      assert.strictEqual(hd.setHoliday('12-25', easterOptions()), true)

      hd = new CoreHolidays(fixtures.custom, 'CUSTOM', {
        timezone: 'UTC',
        plugins: [EasterCalendarPlugin]
      })
      assert.strictEqual(hd.setHoliday('easter -3', easterOptions()), true)
      assert.strictEqual(hd.setHoliday('julian 12-25', easterOptions()), false)
    } finally {
      console.error = previousError
    }
  })

  it('uses the published plugin bundle when explicitly supplied', function () {
    assert.ok(Array.isArray(allPlugins))
    assert.ok(allPlugins.includes(EasterCalendarPlugin))

    const hd = new CoreHolidays(fixtures.custom, 'CUSTOM', {
      timezone: 'UTC',
      plugins: allPlugins
    })
    const easterOptions = () => ({ type: 'public', name: { en: 'Easter' } })
    assert.strictEqual(hd.setHoliday('easter -3', easterOptions()), true)
    assert.strictEqual(hd.setHoliday('orthodox 50', easterOptions()), true)

    const holidays = hd.getHolidays(2015, 'en')
    const goodFriday = holidays.find(({ rule }) => rule === 'easter -3')
    const orthodoxOffset = holidays.find(({ rule }) => rule === 'orthodox 50')
    assert.strictEqual(goodFriday.date, '2015-04-02 00:00:00')
    assert.strictEqual(orthodoxOffset.date, '2015-06-01 00:00:00')
  })

  it('rejects plugin fn names that collide with built-in calendars', function () {
    for (const fnName of [
      'easter',
      'equinox',
      'julian',
      'hebrew',
      'islamic',
      'jalaali',
      'chinese',
      'korean',
      'vietnamese',
      'bengali-revised',
      'tibetan',
      'mongolian',
      'bhutanese'
    ]) {
      const plugin = {
        fnNames: [fnName],
        parse() {
          return { kind: 'no-match' }
        },
        calculate() {
          return []
        }
      }

      assert.throws(
        () =>
          new CoreHolidays(fixtures.custom, 'CUSTOM', {
            plugins: [...allPlugins, plugin]
          }),
        /duplicate calendar plugin fn name/
      )
    }
  })

  it('rejects ambiguous plugin parser matches', function () {
    const makePlugin = (fnName) => ({
      fnNames: [fnName],
      parse(remainingRule) {
        if (remainingRule !== 'collision') return { kind: 'no-match' }
        return { kind: 'match', consumed: remainingRule.length, value: {} }
      },
      calculate() {
        return []
      }
    })
    const hd = new Holidays(fixtures.custom, 'CUSTOM', {
      plugins: [makePlugin('first-calendar'), makePlugin('second-calendar')]
    })

    const consoleError = console.error
    let errorMessage
    try {
      console.error = (message) => {
        errorMessage = message
      }
      assert.strictEqual(hd.setHoliday('collision', { type: 'public' }), false)
    } finally {
      console.error = consoleError
    }
    assert.ok(/ambiguous calendar plugin match/.test(errorMessage))
  })

  it('rejects plugin-reported invalid syntax', function () {
    const plugin = {
      fnNames: ['invalid-calendar'],
      parse(remainingRule) {
        if (remainingRule === 'invalid-calendar') {
          return { kind: 'invalid', message: 'invalid calendar value' }
        }
        return { kind: 'no-match' }
      },
      calculate() {
        return []
      }
    }
    const hd = new Holidays(fixtures.custom, 'CUSTOM', { plugins: [plugin] })

    assert.strictEqual(
      hd.setHoliday('invalid-calendar', { type: 'public' }),
      false
    )
  })

  it('propagates plugin calculator errors', function () {
    const plugin = {
      fnNames: ['error-calendar'],
      parse(remainingRule) {
        if (remainingRule !== 'error-calendar') return { kind: 'no-match' }
        return { kind: 'match', consumed: remainingRule.length, value: {} }
      },
      calculate() {
        throw new Error('calendar calculation failed')
      }
    }
    const hd = new Holidays(fixtures.custom, 'CUSTOM', { plugins: [plugin] })
    assert.strictEqual(
      hd.setHoliday('error-calendar', { type: 'public' }),
      true
    )

    assert.throws(() => hd.getHolidays(2024), /calendar calculation failed/)
  })

  it('keeps plugins instance-local and replaces them only when re-init opts include plugins', function () {
    const makePlugin = (fnName) => ({
      fnNames: [fnName],
      parse(remainingRule) {
        const match = new RegExp('^' + fnName + ' (\\d{1,2})-(\\d{1,2})').exec(
          remainingRule
        )
        if (!match) return { kind: 'no-match' }
        return {
          kind: 'match',
          consumed: match[0].length,
          value: { month: Number(match[1]), day: Number(match[2]) }
        }
      },
      calculate(parsed, year) {
        return [{ year, month: parsed.month, day: parsed.day }]
      }
    })
    const firstPlugin = makePlugin('first-calendar')
    const secondPlugin = makePlugin('second-calendar')
    const hd = new Holidays(fixtures.custom, 'CUSTOM', {
      timezone: 'UTC',
      plugins: [firstPlugin]
    })
    const other = new Holidays(fixtures.custom, 'CUSTOM', { timezone: 'UTC' })
    const options = () => ({ type: 'public' })

    assert.strictEqual(hd.setHoliday('first-calendar 3-11', options()), true)
    assert.strictEqual(
      other.setHoliday('first-calendar 3-11', options()),
      false
    )
    assert.strictEqual(
      other
        .getHolidays(2024)
        .some(({ rule }) => rule === 'first-calendar 3-11'),
      false
    )
    hd.init('CUSTOM')
    assert.strictEqual(hd.setHoliday('first-calendar 3-11', options()), true)

    hd.init('CUSTOM', { timezone: 'UTC', plugins: [secondPlugin] })
    assert.strictEqual(hd.setHoliday('first-calendar 3-11', options()), false)
    assert.strictEqual(hd.setHoliday('second-calendar 3-11', options()), true)
  })

  it('converts plugin local offsets and duration and applies shared modifiers', function () {
    const plugin = {
      fnNames: ['clock-calendar'],
      parse(remainingRule) {
        const match = /^clock-calendar (\d{1,2})-(\d{1,2})/.exec(remainingRule)
        if (!match) return { kind: 'no-match' }
        return {
          kind: 'match',
          consumed: match[0].length,
          value: { month: Number(match[1]), day: Number(match[2]) }
        }
      },
      calculate(parsed, year) {
        const offsetMinutes =
          parsed.day === 10
            ? -360
            : parsed.day === 12
              ? undefined
              : 14 * 60 + 30
        return [
          {
            year,
            month: parsed.month,
            day: parsed.day,
            ...(offsetMinutes === undefined ? {} : { offsetMinutes }),
            duration: parsed.day === 13 ? 1.5 : undefined
          }
        ]
      }
    }
    const hd = new Holidays(fixtures.custom, 'CUSTOM', {
      timezone: 'America/New_York',
      plugins: [plugin]
    })
    const options = { type: 'public' }
    hd.setHoliday('clock-calendar 3-10', { ...options, name: 'DST' })
    hd.setHoliday('clock-calendar 3-10 14:00', {
      ...options,
      name: 'Time override'
    })
    hd.setHoliday('clock-calendar 3-11', { ...options, name: 'Timed' })
    hd.setHoliday('clock-calendar 3-13', { ...options, name: 'Duration' })
    hd.setHoliday('clock-calendar 3-12 16:00 PT4H', {
      ...options,
      name: 'Modified'
    })
    const holidays = hd.getHolidays(2024)
    const dst = holidays.find(({ rule }) => rule === 'clock-calendar 3-10')
    const timeOverride = holidays.find(
      ({ rule }) => rule === 'clock-calendar 3-10 14:00'
    )
    const timed = holidays.find(({ rule }) => rule === 'clock-calendar 3-11')
    const duration = holidays.find(({ rule }) => rule === 'clock-calendar 3-13')
    const modified = holidays.find(
      ({ rule }) => rule === 'clock-calendar 3-12 16:00 PT4H'
    )

    const format = (date) =>
      moment(date).tz('America/New_York').format('YYYY-MM-DD HH:mm')
    assert.strictEqual(dst.date, '2024-03-10 00:00:00 -0600')
    assert.strictEqual(format(dst.start), '2024-03-09 18:00')
    assert.strictEqual(format(dst.end), '2024-03-10 18:00')
    assert.strictEqual(timeOverride.date, '2024-03-10 14:00:00')
    assert.strictEqual(format(timeOverride.start), '2024-03-10 14:00')
    assert.strictEqual(format(timeOverride.end), '2024-03-11 00:00')
    assert.strictEqual(timed.date, '2024-03-11 00:00:00 +1430')
    assert.strictEqual(format(timed.start), '2024-03-11 14:30')
    assert.strictEqual(format(timed.end), '2024-03-12 14:30')
    assert.strictEqual(format(duration.start), '2024-03-13 14:30')
    assert.strictEqual(format(duration.end), '2024-03-13 16:00')
    assert.strictEqual(format(modified.start), '2024-03-12 16:00')
    assert.strictEqual(format(modified.end), '2024-03-12 20:00')
  })
})
