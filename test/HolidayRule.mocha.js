import assert from 'assert'
import { HolidayRule } from '../src/index.js'

describe('HolidayRule', function () {
  it('shall create a rule', function () {
    const rule = new HolidayRule({ rule: '05-01', type: 'public' })
    assert.strictEqual(rule.rule, '05-01')
    assert.strictEqual(rule.type, 'public')
  })

  it('shall disable rule for 2020 and 2018', function () {
    const rule = new HolidayRule({ rule: '05-01', type: 'public' })
    rule.disableIn(2020)
    rule.disableIn(2018)
    assert.strictEqual(rule.rule, '05-01')
    assert.strictEqual(rule.type, 'public')
    assert.deepStrictEqual(rule.disable, ['2018', '2020'])
  })

  it('shall disable rule for 2020-01 and 2018-12', function () {
    const rule = new HolidayRule({ rule: '05-01', type: 'public' })
    rule.disableIn(2020, 1)
    rule.disableIn(2018, 12)
    assert.strictEqual(rule.rule, '05-01')
    assert.strictEqual(rule.type, 'public')
    assert.deepStrictEqual(rule.disable, ['2018-12', '2020-01'])
  })

  it('shall silently ignore undefined year', function () {
    const rule = new HolidayRule({ rule: '05-01', type: 'public' })
    rule.disableIn()
    assert.strictEqual(rule.rule, '05-01')
    assert.strictEqual(rule.type, 'public')
    assert.strictEqual(rule.disable, undefined)
  })
})
