import assert from 'assert'
import Data from '../src/Data.js'

import fixtures from './fixtures/index.cjs'

describe('#Data', function () {
  describe('without providing data', function () {
    const d = new Data()
    it('should instantiate', function () {
      assert.strictEqual(typeof d, 'object')
    })

    it('should get empty list of countries', function () {
      assert.deepStrictEqual(d.getCountries(), {})
    })

    it('should get empty list of holidays', function () {
      assert.deepStrictEqual(d.getRules(), {})
    })
  })

  describe('references', function () {
    const d = new Data(fixtures.refs)
    it('should get rules from A', function () {
      const exp = {
        '01-01': { name: { en: '1st Jan' }, type: 'public' },
        '05-05': { name: '05-05', type: 'public' }
      }

      const res = d.getRules('A')
      assert.deepStrictEqual(res, exp)
    })

    it('should get rules from B.BB', function () {
      const exp = {
        '01-01': { name: { en: '1st Jan' }, type: 'public' },
        '02-02': { name: { en: '2nd Feb' }, type: 'public' },
        '03-03': { name: { en: '3rd Mar' }, type: 'public' }
      }
      const res = d.getRules('B', 'BB')
      // console.log(res)
      assert.deepStrictEqual(res, exp)
    })

    it('should get rules from C.CC', function () {
      const exp = {
        '01-01': { name: { en: '1st Jan' }, type: 'public' },
        '02-02': { name: { en: '2nd Feb' }, type: 'public' },
        '04-04': { name: { en: '4th Apr' }, type: 'public' }
      }
      const res = d.getRules('C-CC')
      // console.log(res)
      assert.deepStrictEqual(res, exp)
    })

    it('should throw for rules from D', function () {
      assert.throws(() => {
        d.getRules('D')
      }, /unknown path for _days: holidays.A.unknown.days/)
    })
  })

  describe('static functions', function () {
    it('can get list of supported countries', function () {
      const obj = new Data(fixtures.holidays).getCountries()
      assert.strictEqual(typeof obj, 'object')
      assert.strictEqual(obj.AT, 'Österreich')
      assert.strictEqual(obj.CH, 'Schweiz')
      assert.strictEqual(obj.DE, 'Deutschland')
      assert.strictEqual(obj.ES, 'España')
      assert.strictEqual(obj.GR, 'Ελλάδα')
    })

    it('can get list of supported states for AT', function () {
      const obj = new Data(fixtures.holidays).getStates('at')
      assert.strictEqual(typeof obj, 'object')
      assert.deepStrictEqual(obj, {
        1: 'Burgenland',
        2: 'Kärnten',
        3: 'Niederösterreich',
        4: 'Oberösterreich',
        5: 'Land Salzburg',
        6: 'Steiermark',
        7: 'Tirol',
        8: 'Vorarlberg',
        9: 'Wien'
      })
    })

    it('can get list of supported states for AT in en', function () {
      const obj = new Data(fixtures.holidays).getStates('at', 'en')
      assert.strictEqual(typeof obj, 'object')
      assert.deepStrictEqual(obj, {
        1: 'Burgenland',
        2: 'Carinthia',
        3: 'Lower Austria',
        4: 'Upper Austria',
        5: 'Salzburg',
        6: 'Styria',
        7: 'Tyrol',
        8: 'Vorarlberg',
        9: 'Vienna'
      })
    })

    it('can get a list of supported regions for DE-BY', function () {
      const obj = new Data(fixtures.holidays).getRegions('DE-BY')
      assert.strictEqual(typeof obj, 'object')
      assert.deepStrictEqual(obj, {
        A: 'Stadt Augsburg',
        EVANG: 'Überwiegend evangelische Gemeinden'
      })
    })

    it('can get substitute names', function () {
      const obj = new Data(fixtures.refs).getSubstitueNames()
      assert.deepStrictEqual(obj, {
        en: 'substitute day',
        bs: 'zamjena dan',
        es: 'día sustituto',
        fr: 'jour substitut'
      }
      )
    })
  })

  describe('can get list of holidays for a country', function () {
    it('for FR', function () {
      const obj = new Data(fixtures.holidays, 'fr').getRules()
      const res = getDays(obj, ['fr'])
      const exp = {
        '01-01': ['public', 'Nouvel An'],
        'easter 1': ['public', 'Lundi de Pâques'],
        '05-01': ['public', 'Fête du travail'],
        '05-08': ['public', 'Fête de la Victoire 1945'],
        'easter 39': ['public', 'Ascension'],
        'easter 49': ['public', 'Pentecôte'],
        'easter 50': ['public', 'Lundi de Pentecôte'],
        'sunday before 06-01': ['observance', 'Fête des Mères'],
        '07-14': ['public', 'Fête Nationale de la France'],
        '08-15': ['public', 'Assomption'],
        '11-01': ['public', 'Toussaint'],
        '11-11': ['public', 'Armistice 1918'],
        '12-25': ['public', 'Noël']
      }
      // ~ console.log(res)
      assert.deepStrictEqual(res, exp)
    })
  })

  describe('can get list of holidays for a state', function () {
    it('for FR-67', function () {
      const obj = new Data(fixtures.holidays, 'FR-67').getRules()
      const res = getDays(obj, ['fr'])
      const exp = {
        '01-01': ['public', 'Nouvel An'],
        'easter 1': ['public', 'Lundi de Pâques'],
        '05-01': ['public', 'Fête du travail'],
        '05-08': ['public', 'Fête de la Victoire 1945'],
        'easter 39': ['public', 'Ascension'],
        'easter 49': ['public', 'Pentecôte'],
        'easter 50': ['public', 'Lundi de Pentecôte'],
        'sunday before 06-01': ['observance', 'Fête des Mères'],
        '07-14': ['public', 'Fête Nationale de la France'],
        '08-15': ['public', 'Assomption'],
        '11-01': ['public', 'Toussaint'],
        '11-11': ['public', 'Armistice 1918'],
        '12-25': ['public', 'Noël'],
        'easter -2': ['public', 'Vendredi saint'],
        '12-26': ['public', 'Lendemain de Noël']
      }
      // ~ console.log(res)
      assert.deepStrictEqual(res, exp)
    })
  })

  describe('can get list of holidays by region', function () {
    const exp = {
      '01-01': ['public', 'Neujahr'],
      '02-14': ['observance', 'Valentinstag'],
      'easter -52': ['observance', 'Weiberfastnacht'],
      'easter -48': ['observance', 'Rosenmontag'],
      'easter -47 14:00': ['observance', 'Faschingsdienstag'],
      'easter -46': ['observance', 'Aschermittwoch'],
      'easter -3': ['observance', 'Gründonnerstag'],
      'easter -2': ['public', 'Karfreitag'],
      easter: ['observance', 'Ostersonntag'],
      'easter 1': ['public', 'Ostermontag'],
      '05-01': ['public', 'Maifeiertag'],
      '2nd sunday in May': ['observance', 'Muttertag'],
      'easter 39': ['public', 'Christi Himmelfahrt'],
      'easter 49': ['observance', 'Pfingstsonntag'],
      'easter 50': ['public', 'Pfingstmontag'],
      '10-03': ['public', 'Tag der Deutschen Einheit'],
      '11-01': ['public', 'Allerheiligen'],
      '11-02': ['observance', 'Allerseelen'],
      '11-11': ['observance', 'Sankt Martin (Faschingsbeginn)'],
      'wednesday before 11-23': ['school', 'Buß- und Bettag'],
      '6th sunday before 12-25': ['observance', 'Volkstrauertag'],
      '5th sunday before 12-25': ['observance', 'Totensonntag'],
      '4th sunday before 12-25': ['observance', '1. Advent'],
      '3th sunday before 12-25': ['observance', '2. Advent'],
      '2nd sunday before 12-25': ['observance', '3. Advent'],
      '1st sunday before 12-25': ['observance', '4. Advent'],
      '12-24 14:00 if sunday then 00:00': ['bank', 'Heiliger Abend'],
      '12-25': ['public', '1. Weihnachtstag'],
      '12-26': ['public', '2. Weihnachtstag'],
      '12-31 14:00 if sunday then 00:00': ['bank', 'Silvester'],
      '2017-10-31': ['public', 'Reformationstag'],
      '01-06': ['public', 'Heilige Drei Könige'],
      '02-02': ['observance', 'Lichtmess'],
      'easter 60': ['public', 'Fronleichnam'],
      '08-15': ['public', 'Mariä Himmelfahrt'],
      '08-08': ['public', 'Augsburger Friedensfest']
    }

    it('for DE BY A', function () {
      const obj = new Data(fixtures.holidays, 'DE', 'BY', 'A').getRules()
      const res = getDays(obj, ['de'])
      // console.log(res)
      assert.deepStrictEqual(res, exp)
    })

    it('for DE-BY-A', function () {
      const obj = new Data(fixtures.holidays, 'DE-BY-A').getRules()
      const res = getDays(obj, ['de'])
      assert.deepStrictEqual(res, exp)
    })

    it('for {DE BY A}', function () {
      const obj = new Data(fixtures.holidays, { country: 'DE', state: 'BY', region: 'A' }).getRules()
      const res = getDays(obj, ['de'])
      assert.deepStrictEqual(res, exp)
    })
  })

  it.skip('devel', function () {
    const obj = new Data(fixtures.holidays, 'gb.sc').getRules()
    /* eslint-disable no-console */
    console.log(obj)
    const res = getDays(obj, ['en'])
    console.log(res)
    /* eslint-enable */
  })
})

// reformat days
function getDays (obj, lang) {
  const res = {}
  Object.keys(obj).forEach(function (p) {
    const arr = []
    let name
    arr.push(obj[p].type)

    for (const i in lang) {
      if ((name = obj[p].name[lang[i]])) {
        arr.push(name)
        break
      }
    }

    res[p] = arr
  })
  return res
}
