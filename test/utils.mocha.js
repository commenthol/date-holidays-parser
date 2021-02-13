/* global describe, it */

import assert from 'assert'
import { toDate } from '../src/internal/utils.js'

describe('toDate', function () {
  it('should convert 2017 to 2017-01-01 to local date', function () {
    const res = toDate(2017)
    assert.strictEqual(res.toString(), new Date('2017-01-01 00:00').toString())
  })
  it('should convert 2017-05 to 2017-05-01 to local date', function () {
    const res = toDate('2017-05')
    assert.strictEqual(res.toString(), new Date('2017-05-01 00:00').toString())
  })
  it('should convert 2017-05-05 to 2017-05-05 to local date', function () {
    const res = toDate('2017-05-05')
    assert.strictEqual(res.toString(), new Date('2017-05-05 00:00').toString())
  })
  it('should convert 2017-05-05 to 2017-05-05 to utc date', function () {
    const res = toDate('2017-05-05', true)
    assert.strictEqual(res.toString(), new Date('2017-05-05T00:00Z').toString())
  })
})
