import assert from 'assert'
import { fixResult } from './helpers.js'

import CalEventFactory from '../src/CalEventFactory.js'
import CalEvent from '../src/CalEvent.js'
import Equinox from '../src/Equinox.js'
import Easter from '../src/Easter.js'
import Hebrew from '../src/Hebrew.js'
import Hijri from '../src/Hijri.js'
import CalDate from 'caldate'

describe('#CalEventFactory', function () {
  it('12-03', function () {
    const date = new CalEventFactory({
      fn: 'gregorian',
      month: 12,
      day: 3
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-12-03 00:00:00',
      start: 'thu 2015-12-03 00:00',
      end: 'fri 2015-12-04 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('march equinox', function () {
    const date = new CalEventFactory({
      fn: 'equinox',
      season: 'march'
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-03-20 00:00:00',
      start: 'fri 2015-03-20 00:00',
      end: 'sat 2015-03-21 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('3 days before Easter', function () {
    const date = new CalEventFactory({
      fn: 'easter',
      offset: -3
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-04-02 00:00:00',
      start: 'thu 2015-04-02 00:00',
      end: 'fri 2015-04-03 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('15 Nisan 5775', function () {
    const date = new CalEventFactory({
      fn: 'hebrew',
      day: 15,
      month: 1
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-04-04 00:00:00 -0600',
      start: 'fri 2015-04-03 18:00',
      end: 'sat 2015-04-04 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('3 Shawwal', function () {
    const date = new CalEventFactory({
      fn: 'islamic',
      day: 3,
      month: 10
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-07-19 00:00:00 -0600',
      start: 'sat 2015-07-18 18:00',
      end: 'sun 2015-07-19 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('5 Jumada al-awwal 1440', function () {
    const date = new CalEventFactory({
      fn: 'islamic',
      day: 5,
      month: 5,
      year: 1440
    })
    const res = date.inYear(2019).get()
    const exp = [{
      date: '2019-01-11 00:00:00 -0600',
      end: 'fri 2019-01-11 18:00',
      start: 'thu 2019-01-10 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('5 Jumada al-awwal 1441', function () {
    const date = new CalEventFactory({
      fn: 'islamic',
      day: 5,
      month: 5,
      year: 1441
    })
    const res = date.inYear(2019).get()
    const exp = [{
      date: '2019-12-31 00:00:00 -0600',
      end: 'tue 2019-12-31 18:00',
      start: 'mon 2019-12-30 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('1 Muharram 1443', function () {
    const date = new CalEventFactory({
      fn: 'islamic',
      day: 1,
      month: 1,
      year: 1443
    })
    const res = date.inYear(2021).get()
    const exp = [{
      date: '2021-08-09 00:00:00 -0600',
      start: 'sun 2021-08-08 18:00',
      end: 'mon 2021-08-09 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })
})

describe('#CalEvent', function () {
  it('12-03', function () {
    const date = new CalEvent({ month: 12, day: 3 })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-12-03 00:00:00',
      start: 'thu 2015-12-03 00:00',
      end: 'fri 2015-12-04 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('2015-12-03', function () {
    const date = new CalEvent({ year: 2015, month: 12, day: 3 })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-12-03 00:00:00',
      start: 'thu 2015-12-03 00:00',
      end: 'fri 2015-12-04 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('2015-12-03 using Date', function () {
    const date = new CalEvent(new Date('2015-12-03 00:00:00'))
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-12-03 00:00:00',
      start: 'thu 2015-12-03 00:00',
      end: 'fri 2015-12-04 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('2015-12-03 in 2016', function () {
    const date = new CalEvent({ year: 2015, month: 12, day: 3 })
    const res = date.inYear(2016).get()
    const exp = []
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('can compare with other event', function () {
    const date = new CalEvent({ year: 2015, month: 12, day: 3 }).inYear(2015)
    const comp = new CalEvent(new Date('2015-12-03 12:00:00')).inYear(2015)
    const res = date.isEqualDate(comp)
    assert.strictEqual(res, true)
  })

  it('can compare with other event of different date', function () {
    const date = new CalEvent({ year: 2015, month: 12, day: 4 }).inYear(2015)
    const comp = new CalEvent(new Date('2015-12-03 12:00:00')).inYear(2015)
    const res = date.isEqualDate(comp)
    assert.strictEqual(res, false)
  })

  it('can push events', function () {
    const date = new CalEvent({ month: 12, day: 3 })
    const date2 = new CalEvent({ month: 12, day: 2 })
      .inYear(2015)
      .inYear(2016)
    date.push(date2)

    const res = date.inYear(2015).get()
    const exp = [
      {
        date: '2015-12-02 00:00:00',
        start: 'wed 2015-12-02 00:00',
        end: 'thu 2015-12-03 00:00'
      },
      {
        date: '2016-12-02 00:00:00',
        start: 'fri 2016-12-02 00:00',
        end: 'sat 2016-12-03 00:00'
      },
      {
        date: '2015-12-03 00:00:00',
        start: 'thu 2015-12-03 00:00',
        end: 'fri 2015-12-04 00:00'
      }
    ]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('can reset events', function () {
    const ev = new CalEvent({ month: 12, day: 2 })
      .inYear(2015)
      .inYear(2016)

    assert.strictEqual(ev.dates.length, 2)
    ev.reset()
    assert.strictEqual(ev.dates.length, 0)
  })

  it('filter active dates for 2015 without active range', function () {
    const ev = new CalEvent({ month: 12, day: 2 })
      .inYear(2014)
      .inYear(2015)
      .filterActive(2015)
    assert.deepStrictEqual(ev.dates, [new CalDate({ year: 2015, month: 12, day: 2 })])
  })

  it('filter active dates for 2014', function () {
    const ev = new CalEvent({ month: 12, day: 2 })
      .inYear(2014)
      .inYear(2015)
      .setActive({ from: new Date('2015-01-01'), to: new Date('2015-12-31') })
      .filterActive(2014)
    // console.log(ev)
    assert.deepStrictEqual(ev.dates, [])
  })

  it('filter active dates for 2015', function () {
    const ev = new CalEvent({ month: 12, day: 2 })
      .inYear(2014)
      .inYear(2015)
      .setActive({ from: new Date('2015-01-01'), to: new Date('2015-12-31') })
      .filterActive(2015)
    assert.deepStrictEqual(ev.dates, [new CalDate({ year: 2015, month: 12, day: 2 })])
  })

  it('shall combine active range', function () {
    const ev = new CalEvent({ month: 12, day: 2 })
      .setActive({ from: new Date('2014-01-01') })
      .setActive({ to: new Date('2014-12-31') })
    assert.deepStrictEqual(ev.active, [
      { from: new Date('2014-01-01'), to: new Date('2014-12-31') }
    ])
  })

  describe('filter', function () {
    function activeFiterTest (event, active, tests) {
      tests.forEach((test) => {
        const year = test.year
        const exp = test.exp
        it('in year ' + year, function () {
          const date = new CalEvent(event)
          date.inYear(year).filterActive(year, active)
          const res = date.get()
          assert.strictEqual(res.length, exp.length)
          if (exp.length) {
            assert.strictEqual(res[0].date, exp[0].date)
          }
        })
      })
    }

    describe('with full years', function () {
      const event = { month: 12, day: 3 }
      const active = [
        { to: new Date(1960, 0, 1) },
        { from: new Date(1990, 0, 1), to: new Date(1999, 0, 1) },
        { from: new Date(2004, 0, 1), to: new Date(2005, 0, 1) },
        { from: new Date(2016, 0, 1) }
      ]
      const tests = [
        { year: 1959, exp: [{ date: '1959-12-03 00:00:00' }] },
        { year: 1960, exp: [] },
        { year: 1989, exp: [] },
        { year: 1990, exp: [{ date: '1990-12-03 00:00:00' }] },
        { year: 1995, exp: [{ date: '1995-12-03 00:00:00' }] },
        { year: 1999, exp: [] },
        { year: 2000, exp: [] },
        { year: 2003, exp: [] },
        { year: 2016, exp: [{ date: '2016-12-03 00:00:00' }] },
        { year: 2050, exp: [{ date: '2050-12-03 00:00:00' }] }
      ]
      activeFiterTest(event, active, tests)
    })

    describe('with dates', function () {
      const event = { month: 8, day: 3 }
      const active = [
        { to: new Date(1960, 7, 1) },
        { from: new Date(1990, 7, 1), to: new Date(1999, 6, 1) },
        { from: new Date(2004, 7, 4), to: new Date(2005, 0, 1) },
        { from: new Date(2016, 7, 3) }
      ]
      const tests = [
        { year: 1959, exp: [{ date: '1959-08-03 00:00:00' }] },
        { year: 1960, exp: [] },
        { year: 1989, exp: [] },
        { year: 1990, exp: [{ date: '1990-08-03 00:00:00' }] },
        { year: 1995, exp: [{ date: '1995-08-03 00:00:00' }] },
        { year: 1999, exp: [] },
        { year: 2004, exp: [] },
        { year: 2005, exp: [] },
        { year: 2016, exp: [{ date: '2016-08-03 00:00:00' }] },
        { year: 2050, exp: [{ date: '2050-08-03 00:00:00' }] }
      ]
      activeFiterTest(event, active, tests)
    })
  })
})

describe('#Easter', function () {
  it('3 days before Easter', function () {
    const date = new Easter({ offset: -3 })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-04-02 00:00:00',
      start: 'thu 2015-04-02 00:00',
      end: 'fri 2015-04-03 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('50 days after Orthodox Easter', function () {
    const date = new Easter({ offset: 50, type: 'orthodox' })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-06-01 00:00:00',
      start: 'mon 2015-06-01 00:00',
      end: 'tue 2015-06-02 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })
})

describe('#Equinox', function () {
  it('march equinox', function () {
    const date = new Equinox({ season: 'march' })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-03-20 00:00:00',
      start: 'fri 2015-03-20 00:00',
      end: 'sat 2015-03-21 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('march equinox in Asia/Tokyo', function () {
    const date = new Equinox({ season: 'march', timezone: 'Asia/Tokyo' })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-03-21 00:00:00',
      start: 'sat 2015-03-21 00:00',
      end: 'sun 2015-03-22 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('march equinox in +01:00', function () {
    const date = new Equinox({ season: 'march', timezone: '+01:00' })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-03-20 00:00:00',
      start: 'fri 2015-03-20 00:00',
      end: 'sat 2015-03-21 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('3 days after september equinox', function () {
    const date = new Equinox({ season: 'september', offset: 3 })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-09-26 00:00:00',
      start: 'sat 2015-09-26 00:00',
      end: 'sun 2015-09-27 00:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })
})

describe('#Hebrew', function () {
  // hebrew calendar
  it('15 Nisan 5775', function () {
    const date = new Hebrew({
      day: 15,
      month: 1
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-04-04 00:00:00 -0600',
      start: 'fri 2015-04-03 18:00',
      end: 'sat 2015-04-04 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('15 Nisan 5776', function () {
    const date = new Hebrew({
      day: 15,
      month: 1
    })
    const res = date.inYear(2016).get()
    const exp = [{
      date: '2016-04-23 00:00:00 -0600',
      start: 'fri 2016-04-22 18:00',
      end: 'sat 2016-04-23 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('18 Tevet 5775/ 5776', function () {
    const date = new Hebrew({
      day: 18,
      month: 10
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-01-09 00:00:00 -0600',
      start: 'thu 2015-01-08 18:00',
      end: 'fri 2015-01-09 18:00'
    }, {
      date: '2015-12-30 00:00:00 -0600',
      start: 'tue 2015-12-29 18:00',
      end: 'wed 2015-12-30 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('18 Tevet in gregorian year 2016', function () {
    const date = new Hebrew({
      day: 18,
      month: 10
    })
    const res = date.inYear(2016).get()
    const exp = []
    assert.deepStrictEqual(fixResult(res), exp)
  })
})

describe('#Hijri', function () {
  // hijri calendar
  it('3 Shawwal', function () {
    const date = new Hijri({
      day: 3,
      month: 10
    })
    const res = date.inYear(2015).get()
    const exp = [{
      date: '2015-07-19 00:00:00 -0600',
      start: 'sat 2015-07-18 18:00',
      end: 'sun 2015-07-19 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  // hijri calendar
  it('27 Rabi al-awwal', function () {
    const date = new Hijri({
      day: 27,
      month: 3
    })
    const res = date.inYear(2016).get()
    const exp = [{
      date: '2016-01-07 00:00:00 -0600',
      start: 'wed 2016-01-06 18:00',
      end: 'thu 2016-01-07 18:00'
    }, {
      date: '2016-12-26 00:00:00 -0600',
      start: 'sun 2016-12-25 18:00',
      end: 'mon 2016-12-26 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('27 Rabi al-awwal 1438', function () {
    const date = new Hijri({
      day: 27,
      month: 3,
      year: 1438
    })
    const res = date.inYear(2016).get()
    const exp = [{
      date: '2016-12-26 00:00:00 -0600',
      start: 'sun 2016-12-25 18:00',
      end: 'mon 2016-12-26 18:00'
    }]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('27 Rabi al-awwal outside supported range', function () {
    const date = new Hijri({
      day: 27,
      month: 3
    })
    const res = date.inYear(1800).get()
    const exp = []
    assert.deepStrictEqual(fixResult(res), exp)
  })
})
