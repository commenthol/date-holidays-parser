import assert from 'node:assert/strict'
import { merge } from '../src/utils.js'

describe('holiday data merge', function () {
  it('starts with an empty object and clones a single input', function () {
    const input = { name: { en: 'Holiday' } }
    assert.deepEqual(merge(), {})
    assert.deepEqual(merge(input), input)
    assert.notEqual(merge(input).name, input.name)
  })

  it('combines translated names and overrides rule properties in order', function () {
    const names = { name: { en: 'Holiday', fr: 'Jour' }, type: 'public' }
    const rule = { name: { en: 'Local holiday' }, type: 'bank' }
    assert.deepEqual(merge({}, names, rule), {
      name: { en: 'Local holiday', fr: 'Jour' },
      type: 'bank'
    })
    assert.equal(names.name.en, 'Holiday')
    assert.deepEqual(rule.name, { en: 'Local holiday' })
  })

  it('concatenates arrays and clones their objects', function () {
    const item = { from: '2026-01-01' }
    const result = merge({ active: [item] }, { active: [{ to: '2027-01-01' }] })
    assert.deepEqual(result.active, [item, { to: '2027-01-01' }])
    assert.notEqual(result.active[0], item)
  })

  it('preserves dates, regular expressions, callbacks and undefined overrides', function () {
    const start = new Date('2026-01-01T00:00Z')
    const expression = /holiday/
    const callback = () => true
    const result = merge(
      { name: 'old' },
      { start, expression, callback, name: undefined }
    )
    assert.equal(result.start, start)
    assert.equal(result.expression, expression)
    assert.equal(result.callback, callback)
    assert.ok(Object.hasOwn(result, 'name'))
    assert.equal(result.name, undefined)
  })

  it('merges enumerable symbols and excludes nonenumerable properties', function () {
    const symbol = Symbol('metadata')
    const first = { [symbol]: { keep: true } }
    const second = { [symbol]: { add: true } }
    Object.defineProperty(second, 'hidden', { value: true })
    const result = merge(first, second)
    assert.deepEqual(result[symbol], { keep: true, add: true })
    assert.notEqual(result[symbol], second[symbol])
    assert.equal(result.hidden, undefined)
  })

  for (const placeholder of [
    null,
    undefined,
    0,
    false,
    '',
    Object.create(null)
  ]) {
    it(`keeps the returned prototype intact after placeholder ${String(placeholder === null ? 'null' : typeof placeholder)}`, function () {
      const input = JSON.parse(
        '{"nested":{"__proto__":{"injected":true},"safe":1}}'
      )
      const result = merge({ nested: placeholder }, input)
      assert.equal(Object.getPrototypeOf(result.nested), Object.prototype)
      assert.equal(result.nested.injected, undefined)
      assert.equal(result.nested.safe, 1)
      assert.equal({}.injected, undefined)
    })
  }

  it('discards reserved keys from both inputs, including target-only values', function () {
    const input = JSON.parse(
      '{"__proto__":{},"constructor":{},"prototype":{},"safe":1}'
    )
    assert.deepEqual(merge({ nested: input }, {}), { nested: { safe: 1 } })
    assert.deepEqual(merge({}, { nested: input }), { nested: { safe: 1 } })
  })
})
