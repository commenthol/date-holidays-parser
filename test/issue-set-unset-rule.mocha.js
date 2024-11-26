import assert from 'assert'
import Holidays from '../src/index.js'
import fixtures from './fixtures/index.cjs'

const fixture = fixtures.holidays

describe('#issue-set-unset-rule', function () {
  it('should not throw if rule is unset', function () {
    const hd = new Holidays(fixture, 'AR')
    hd.unsetRule('12-31 12:00')
    hd.setHoliday('12-31')
    assert.deepEqual(hd.isHoliday('2024-12-31T12:00:00Z'), [{
      date: '2024-12-31 00:00:00',
      end: new Date('2025-01-01T03:00:00.000Z'),
      name: '12-31',
      start: new Date('2024-12-31T03:00:00.000Z'),
      type: 'public'
    }])
  })
})
