/* global describe, it */

import assert from 'assert'
import { toDate } from '../src/internal/utils.js'
import { merge } from '../src/utils.js'

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

describe('merge', function () {
  it('should deep merge objects into a new object', function () {
    const a = { name: { en: 'a', fr: 'a' }, type: 'public' }
    const b = { name: { fr: 'b' }, note: 'x' }
    const res = merge({}, a, b)
    assert.deepStrictEqual(res, { name: { en: 'a', fr: 'b' }, type: 'public', note: 'x' })
    assert.notStrictEqual(res.name, a.name)
    assert.deepStrictEqual(a, { name: { en: 'a', fr: 'a' }, type: 'public' })
  })
  it('should concatenate arrays and clone their items', function () {
    const item = { a: 1 }
    const res = merge({}, { list: [item] }, { list: [2] })
    assert.deepStrictEqual(res, { list: [{ a: 1 }, 2] })
    assert.notStrictEqual(res.list[0], item)
  })
  it('should keep Date and RegExp values by reference', function () {
    const start = new Date('2026-01-01T00:00:00Z')
    const re = /x/
    const res = merge({}, { start, re })
    assert.strictEqual(res.start, start)
    assert.strictEqual(res.re, re)
  })
  it('should replace a value of a different type', function () {
    assert.deepStrictEqual(merge({}, { a: 'x' }, { a: { b: 1 } }), { a: { b: 1 } })
    assert.deepStrictEqual(merge({}, { a: [1] }, { a: { b: 1 } }), { a: { b: 1 } })
  })
  it('should never copy __proto__ keys', function () {
    const source = JSON.parse('{"__proto__": {"polluted": true}, "a": {"__proto__": {"polluted": true}}}')
    const res = merge({}, source)
    assert.strictEqual(Object.getPrototypeOf(res), Object.prototype)
    assert.strictEqual(Object.getPrototypeOf(res.a), Object.prototype)
    assert.strictEqual(res.polluted, undefined)
    assert.strictEqual(res.a.polluted, undefined)
    assert.strictEqual({}.polluted, undefined)
  })
  it('should never copy __proto__ keys into a nested null-prototype object', function () {
    const placeholder = Object.create(null)
    placeholder.a = 1
    const source = JSON.parse('{"nested": {"__proto__": {"polluted": true}}}')
    const res = merge({}, { nested: placeholder }, source)
    assert.strictEqual(res.nested.polluted, undefined)
    assert.strictEqual(Object.getPrototypeOf(res.nested), Object.prototype)
    assert.strictEqual(res.nested.a, 1)
  })
})
