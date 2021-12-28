import assert from 'assert'
import Holidays from '../src/index.js'

const fixture = {
  holidays: {
    TEST: {
      days: {
        '10 Dhu al-Hijjah': {
          name: '10 Dhu al-Hijjah'
        },
        '1 Tishrei': {
          name: '10 Tishrei'
        }
      }
    }
  }
}

describe('#issue-hijra', function () {
  const hd = new Holidays(fixture, 'TEST')
  // console.log(hd.getHolidays())

  it('shall return immutable hijra date', function () {
    assert.ok(hd.getHolidays().length > 0)

    for (let i = 0; i < 200; i++) {
      assert.ok(!!hd.isHoliday(new Date('2021-07-20 00:00:00')), i)
    }
  })

  it('shall return immutable hebrew dates', function () {
    assert.ok(hd.getHolidays().length > 0)

    for (let i = 0; i < 200; i++) {
      assert.ok(!!hd.isHoliday(new Date('2021-09-07 00:00:00')), i)
    }
  })
})
