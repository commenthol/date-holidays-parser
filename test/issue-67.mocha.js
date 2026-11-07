import assert from 'assert'
import Holidays from '../src/index.js'

const beforeRule =
  'Monday after 2nd saturday in June prior to 2022-09-09 if is public holiday then next monday'
const afterRule =
  'Monday after 2nd saturday in June since 2022-09-09 if is public holiday then next monday'

const fixture = {
  holidays: {
    TEST: {
      names: { en: 'test' },
      dayoff: 'sunday',
      zones: ['Etc/UTC'],
      langs: ['en'],
      days: {
        [beforeRule]: {
          name: { en: 'conditional before cutoff' },
          type: 'public'
        },
        [afterRule]: {
          name: { en: 'conditional after cutoff' },
          type: 'public'
        },
        '2022-06-13': {
          name: { en: 'public holiday in 2022' },
          type: 'public'
        },
        '2023-06-12': {
          name: { en: 'public holiday in 2023' },
          type: 'public'
        }
      }
    }
  }
}

describe('#issue-67', function () {
  it('calculates both date-ranged conditional public holidays without recursion', function () {
    const hd = new Holidays(fixture, 'TEST')
    const getRuleDates = (year) =>
      hd.getHolidays(year).map(({ date, rule }) => [rule, date.slice(0, 10)])

    assert.deepStrictEqual(getRuleDates(2022), [
      ['2022-06-13', '2022-06-13'],
      [beforeRule, '2022-06-20']
    ])
    assert.deepStrictEqual(getRuleDates(2023), [
      ['2023-06-12', '2023-06-12'],
      [afterRule, '2023-06-19']
    ])
    assert.deepStrictEqual(getRuleDates(2024), [[afterRule, '2024-06-10']])
  })
})
