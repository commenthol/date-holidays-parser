/* global describe, it */

import assert from 'assert'
import { fixResult } from './helpers.js'
import Rule from '../src/Rule.js'
import CalEventFactory from '../src/CalEventFactory.js'

import testcases from './fixtures/parser.cjs'

describe('#Rule', function () {
  it('can resolve rule dateIfThen', function () {
    const tc = testcases['01-01 if monday then next monday']
    const ruleFn = new Rule()
    const calEvent = new CalEventFactory(tc[0]).inYear(2018)
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2018-01-08 00:00:00',
      start: 'mon 2018-01-08 00:00',
      end: 'tue 2018-01-09 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve time rule', function () {
    const tc = testcases['01-01 14:00']
    const ruleFn = new Rule()
    const calEvent = new CalEventFactory(tc[0]).inYear(2015)
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2015-01-01 14:00:00',
      start: 'thu 2015-01-01 14:00',
      end: 'fri 2015-01-02 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateIfThen with time', function () {
    const tc = testcases['05-01 14:00 if sunday then 00:00']
    const ruleFn = new Rule()
    const calEvent = new CalEventFactory(tc[0]).inYear(2016)
    ruleFn.setEvent(calEvent).resolve(tc[1]).resolve(tc[2])
    const exp = [{
      date: '2016-05-01 00:00:00',
      start: 'sun 2016-05-01 00:00',
      end: 'mon 2016-05-02 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateDir', function () {
    const tc = testcases['wednesday before 11-23']
    const calEvent = new CalEventFactory(tc[0]).inYear(2016)
    const ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2016-11-16 00:00:00',
      start: 'wed 2016-11-16 00:00',
      end: 'thu 2016-11-17 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateDir using day count before', function () {
    const tc = testcases['4 days before 11-23']
    const calEvent = new CalEventFactory(tc[0]).inYear(2016)
    const ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2016-11-19 00:00:00',
      start: 'sat 2016-11-19 00:00',
      end: 'sun 2016-11-20 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateDir using day count after', function () {
    const tc = testcases['4 days after 11-27']
    const calEvent = new CalEventFactory(tc[0]).inYear(2016)
    const ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2016-12-01 00:00:00',
      start: 'thu 2016-12-01 00:00',
      end: 'fri 2016-12-02 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule year', function () {
    const tc = testcases['11-01 in odd years']
    const calEvent = new CalEventFactory(tc[0]).inYear(2015)
    const ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2015-11-01 00:00:00',
      start: 'sun 2015-11-01 00:00',
      end: 'mon 2015-11-02 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateBridge', function () {
    const tc = testcases['09-22 if 09-21 is holiday']
    const calEvent = new CalEventFactory(tc[0]).inYear(2015)
    const ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2015-09-22 00:00:00',
      start: 'tue 2015-09-22 00:00',
      end: 'wed 2015-09-23 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule weekday', function () {
    const tc = testcases['09-22 on sunday, saturday']
    const calEvent = new CalEventFactory(tc[0]).inYear(2013)
    const ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    const exp = [{
      date: '2013-09-22 00:00:00',
      start: 'sun 2013-09-22 00:00',
      end: 'mon 2013-09-23 00:00'
    }]
    assert.deepStrictEqual(fixResult(calEvent.get()), exp)
  })
})
