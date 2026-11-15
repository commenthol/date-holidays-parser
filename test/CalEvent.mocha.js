import assert from 'assert'
import { fixResult } from './helpers.js'

import CalEvent from '../src/CalEvent.js'
import CalDate from 'caldate'

describe('#CalEvent', function () {
  it('12-03', function () {
    const date = new CalEvent({ month: 12, day: 3 })
    const res = date.inYear(2015).get()
    const exp = [
      {
        date: '2015-12-03 00:00:00',
        start: 'thu 2015-12-03 00:00',
        end: 'fri 2015-12-04 00:00'
      }
    ]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('2015-12-03', function () {
    const date = new CalEvent({ year: 2015, month: 12, day: 3 })
    const res = date.inYear(2015).get()
    const exp = [
      {
        date: '2015-12-03 00:00:00',
        start: 'thu 2015-12-03 00:00',
        end: 'fri 2015-12-04 00:00'
      }
    ]
    assert.deepStrictEqual(fixResult(res), exp)
  })

  it('2015-12-03 using Date', function () {
    const date = new CalEvent(new Date('2015-12-03 00:00:00'))
    const res = date.inYear(2015).get()
    const exp = [
      {
        date: '2015-12-03 00:00:00',
        start: 'thu 2015-12-03 00:00',
        end: 'fri 2015-12-04 00:00'
      }
    ]
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
    const date2 = new CalEvent({ month: 12, day: 2 }).inYear(2015).inYear(2016)
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
    const ev = new CalEvent({ month: 12, day: 2 }).inYear(2015).inYear(2016)

    assert.strictEqual(ev.dates.length, 2)
    ev.reset()
    assert.strictEqual(ev.dates.length, 0)
  })

  it('filter active dates for 2015 without active range', function () {
    const ev = new CalEvent({ month: 12, day: 2 })
      .inYear(2014)
      .inYear(2015)
      .filterActive(2015)
    assert.deepStrictEqual(ev.dates, [
      new CalDate({ year: 2015, month: 12, day: 2 })
    ])
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
    assert.deepStrictEqual(ev.dates, [
      new CalDate({ year: 2015, month: 12, day: 2 })
    ])
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
    function activeFiterTest(event, active, tests) {
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
