import assert from 'assert'
import DateFn from '../src/DateFn.js'
import { fixResult } from './helpers.js'

describe('#DateFn', function () {
  describe('Fixed Date', function () {
    it('03-12', function () {
      const fn = new DateFn('03-12')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-03-12 00:00:00',
        start: 'sat 2016-03-12 00:00',
        end: 'sun 2016-03-13 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('03-12T16', function () {
      const fn = new DateFn('03-12T16')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-03-12 16:00:00',
        start: 'sat 2016-03-12 16:00',
        end: 'sun 2016-03-13 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('2015-10-09', function () {
      const fn = new DateFn('2015-10-09')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-10-09 00:00:00',
        start: 'fri 2015-10-09 00:00',
        end: 'sat 2015-10-10 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('2015-10-09 for 2016', function () {
      const fn = new DateFn('2015-10-09')
      const res = fn.inYear(2016).get()
      assert.ok(!res.length)
    })

    it('julian 12-25', function () {
      const fn = new DateFn('julian 12-25')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-01-07 00:00:00',
        start: 'thu 2016-01-07 00:00',
        end: 'fri 2016-01-08 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('julian 2016-12-25 in 2017', function () {
      const fn = new DateFn('julian 2016-12-25')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-01-07 00:00:00',
        start: 'sat 2017-01-07 00:00',
        end: 'sun 2017-01-08 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('julian 2016-12-25 in 2018', function () {
      const fn = new DateFn('julian 2016-12-25')
      const res = fn.inYear(2018).get()
      assert.ok(!res.length)
    })
  })

  describe('Movable Date', function () {
    describe('christian dates', function () {
      it('3 days before Easter', function () {
        const fn = new DateFn('easter -3')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-04-02 00:00:00',
          start: 'thu 2015-04-02 00:00',
          end: 'fri 2015-04-03 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('50 days after Orthodox Easter', function () {
        const fn = new DateFn('orthodox 50')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-06-01 00:00:00',
          start: 'mon 2015-06-01 00:00',
          end: 'tue 2015-06-02 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })
    })

    describe('islamic dates', function () {
      // hijri calendar
      it('3 Shawwal', function () {
        const fn = new DateFn('3 Shawwal')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-07-19 00:00:00 -0600',
          start: 'sat 2015-07-18 18:00',
          end: 'sun 2015-07-19 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('13 Rabi al-thani', function () {
        const fn = new DateFn('13 Rabi al-thani')
        const res = fn.inYear(2017).get()
        const exp = [{
          date: '2017-01-11 00:00:00 -0600',
          start: 'tue 2017-01-10 18:00',
          end: 'wed 2017-01-11 18:00'
        }, {
          date: '2017-12-31 00:00:00 -0600',
          start: 'sat 2017-12-30 18:00',
          end: 'sun 2017-12-31 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('29 Dhu al-Hijjah 1442', function () {
        const fn = new DateFn('29 Dhu al-Hijjah 1442')
        const res = fn.inYear(2021).get()
        const exp = [{
          date: '2021-08-08 00:00:00 -0600',
          start: 'sat 2021-08-07 18:00',
          end: 'sun 2021-08-08 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('1 Muharram 1443', function () {
        const fn = new DateFn('1 Muharram 1443')
        const res = fn.inYear(2021).get()
        const exp = [{
          date: '2021-08-09 00:00:00 -0600',
          start: 'sun 2021-08-08 18:00',
          end: 'mon 2021-08-09 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })
    })

    describe('jalaali dates', function () {
      // jalaali calendar
      it('1 Farvardin', function () {
        const fn = new DateFn('1 Farvardin')
        const res = fn.inYear(2022).get()
        const exp = [{
          date: '2022-03-21 00:00:00',
          end: 'tue 2022-03-22 00:00',
          start: 'mon 2022-03-21 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('29 Esfand 1400', function () {
        const fn = new DateFn('29 Esfand 1400')
        const res = fn.inYear(2022).get()
        const exp = [{
          date: '2022-03-20 00:00:00',
          end: 'mon 2022-03-21 00:00',
          start: 'sun 2022-03-20 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })
    })

    describe('hebrew calendar', function () {
      // hebrew calendar
      it('15 Nisan 5775', function () {
        const fn = new DateFn('15 Nisan')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-04-04 00:00:00 -0600',
          start: 'fri 2015-04-03 18:00',
          end: 'sat 2015-04-04 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('15 Nisan 5776', function () {
        const fn = new DateFn('15 Nisan')
        const res = fn.inYear(2016).get()
        const exp = [{
          date: '2016-04-23 00:00:00 -0600',
          start: 'fri 2016-04-22 18:00',
          end: 'sat 2016-04-23 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('18 Tevet 5775/ 5776', function () {
        const fn = new DateFn('18 Tevet')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-01-09 00:00:00 -0600',
          start: 'thu 2015-01-08 18:00',
          end: 'fri 2015-01-09 18:00'
        }, {
          date: '2015-12-30 00:00:00 -0600',
          start: 'tue 2015-12-29 18:00',
          end: 'wed 2015-12-30 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('No Tevet 1 in gregorian year 2024', function () {
        const fn = new DateFn('1 Tevet')
        const res = fn.inYear(2024).get()
        assert.deepStrictEqual(res, [])
      })

      it('No Tevet 19 in gregorian year 2024', function () {
        const fn = new DateFn('19 Tevet')
        const res = fn.inYear(2024).get()
        assert.deepStrictEqual(res, [])
      })

      it('Tevet 20 in gregorian year 2024', function () {
        const fn = new DateFn('20 Tevet')
        const res = fn.inYear(2024).get()
        const exp = [{
          date: '2024-01-01 00:00:00 -0600',
          end: 'mon 2024-01-01 18:00',
          start: 'sun 2023-12-31 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('twice Tevet 1 in gregorian year 2025', function () {
        const fn = new DateFn('1 Tevet')
        const res = fn.inYear(2025).get()
        const exp = [{
          date: '2025-01-01 00:00:00 -0600',
          end: 'wed 2025-01-01 18:00',
          start: 'tue 2024-12-31 18:00'
        }, {
          date: '2025-12-21 00:00:00 -0600',
          end: 'sun 2025-12-21 18:00',
          start: 'sat 2025-12-20 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('twice Tevet 11 in gregorian year 2025', function () {
        const fn = new DateFn('11 Tevet')
        const res = fn.inYear(2025).get()
        const exp = [{
          date: '2025-01-11 00:00:00 -0600',
          end: 'sat 2025-01-11 18:00',
          start: 'fri 2025-01-10 18:00'
        }, {
          date: '2025-12-31 00:00:00 -0600',
          end: 'wed 2025-12-31 18:00',
          start: 'tue 2025-12-30 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('only once Tevet 12 in gregorian year 2025', function () {
        const fn = new DateFn('12 Tevet')
        const res = fn.inYear(2025).get()
        const exp = [{
          date: '2025-01-12 00:00:00 -0600',
          end: 'sun 2025-01-12 18:00',
          start: 'sat 2025-01-11 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('6 Adar 5779', function () {
        const fn = new DateFn('6 Adar 5779')
        const res = fn.inYear(2019).get()
        const exp = [{
          date: '2019-02-11 00:00:00 -0600',
          start: 'sun 2019-02-10 18:00',
          end: 'mon 2019-02-11 18:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('Purim in year 2014', function () {
        const fn = new DateFn('14 AdarII')
        const res = fn.inYear(2014).get()
        assert.deepStrictEqual(fixResult(res), [{
          date: '2014-03-16 00:00:00 -0600',
          start: 'sat 2014-03-15 18:00',
          end: 'sun 2014-03-16 18:00'
        }])
      })
    })

    describe('equinox', function () {
      it('march equinox', function () {
        const fn = new DateFn('march equinox')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-03-20 00:00:00',
          start: 'fri 2015-03-20 00:00',
          end: 'sat 2015-03-21 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('march equinox in Asia/Tokyo', function () {
        const fn = new DateFn('march equinox in Asia/Tokyo')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-03-21 00:00:00',
          start: 'sat 2015-03-21 00:00',
          end: 'sun 2015-03-22 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('3 days after september equinox', function () {
        const fn = new DateFn('3 days after september equinox')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-09-26 00:00:00',
          start: 'sat 2015-09-26 00:00',
          end: 'sun 2015-09-27 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('1 day before june solstice', function () {
        const fn = new DateFn('1 day before june solstice')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-06-20 00:00:00',
          start: 'sat 2015-06-20 00:00',
          end: 'sun 2015-06-21 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('3rd monday before december solstice', function () {
        const fn = new DateFn('3rd monday before december solstice')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-12-07 00:00:00',
          start: 'mon 2015-12-07 00:00',
          end: 'tue 2015-12-08 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })
    })

    describe('chinese', function () {
      it('chinese 01-0-01', function () {
        const fn = new DateFn('chinese 01-0-01')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-02-19 00:00:00',
          start: 'thu 2015-02-19 00:00',
          end: 'fri 2015-02-20 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('chinese 8-15 solarterm', function () {
        const fn = new DateFn('chinese 8-15 solarterm')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-06-04 00:00:00',
          start: 'thu 2015-06-04 00:00',
          end: 'fri 2015-06-05 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('korean 1-0-1', function () {
        const fn = new DateFn('korean 1-0-1')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-02-19 00:00:00',
          start: 'thu 2015-02-19 00:00',
          end: 'fri 2015-02-20 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })

      it('vietnamese 1-0-1', function () {
        const fn = new DateFn('vietnamese 1-0-1')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-02-19 00:00:00',
          start: 'thu 2015-02-19 00:00',
          end: 'fri 2015-02-20 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })
    })

    describe('bengali-revised', function () {
      it('bengali-revised 1-1', function () {
        const fn = new DateFn('bengali-revised 1-1')
        const res = fn.inYear(2015).get()
        const exp = [{
          date: '2015-04-14 00:00:00',
          start: 'tue 2015-04-14 00:00',
          end: 'wed 2015-04-15 00:00'
        }]
        assert.deepStrictEqual(fixResult(res), exp)
      })
    })

    it('bengali-revised 12-1', function () {
      const fn = new DateFn('bengali-revised 12-1')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-03-15 00:00:00',
        start: 'sun 2015-03-15 00:00',
        end: 'mon 2015-03-16 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Different start-time', function () {
    it('01-01 14:00', function () {
      const fn = new DateFn('01-01 14:00')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-01-01 14:00:00',
        start: 'thu 2015-01-01 14:00',
        end: 'fri 2015-01-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('easter -3 16:00', function () {
      const fn = new DateFn('easter -3 16:00')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-04-02 16:00:00',
        start: 'thu 2015-04-02 16:00',
        end: 'fri 2015-04-03 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Different Duration', function () {
    it('09-04 08:00 PT14H', function () {
      const fn = new DateFn('09-04 08:00 PT14H')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-09-04 08:00:00',
        start: 'fri 2015-09-04 08:00',
        end: 'fri 2015-09-04 22:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('09-04 08:00 PT321H', function () {
      const fn = new DateFn('09-04 08:00 PT321H')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-09-04 08:00:00',
        start: 'fri 2015-09-04 08:00',
        end: 'thu 2015-09-17 17:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('easter -3 14:00 PT4H', function () {
      const fn = new DateFn('easter -3 14:00 PT4H')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-04-02 14:00:00',
        start: 'thu 2015-04-02 14:00',
        end: 'thu 2015-04-02 18:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('easter -3 14:00 P3D', function () {
      const fn = new DateFn('easter -3 14:00 P3D')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-04-02 14:00:00',
        start: 'thu 2015-04-02 14:00',
        end: 'sun 2015-04-05 14:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Start-time changes per weekday', function () {
    it('05-01 14:00 if sunday then 00:00 in 2015', function () {
      const fn = new DateFn('05-01 14:00 if sunday then 00:00')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-05-01 14:00:00',
        start: 'fri 2015-05-01 14:00',
        end: 'sat 2015-05-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('05-01 14:00 if sunday then 00:00 in 2016', function () {
      const fn = new DateFn('05-01 14:00 if sunday then 00:00')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-05-01 00:00:00',
        start: 'sun 2016-05-01 00:00',
        end: 'mon 2016-05-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('12-31 14:00 if sunday then 00:00 in 2015', function () {
      const fn = new DateFn('12-31 14:00 if sunday then 00:00')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-12-31 14:00:00',
        start: 'thu 2015-12-31 14:00',
        end: 'fri 2016-01-01 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('12-31 14:00 if sunday then 00:00 in 2017', function () {
      const fn = new DateFn('12-31 14:00 if sunday then 00:00')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-12-31 00:00:00',
        start: 'sun 2017-12-31 00:00',
        end: 'mon 2018-01-01 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('01-01 if sunday then next monday 14:12 if friday then 15:23 in 2017', function () {
      const fn = new DateFn('01-01 if sunday then next monday 14:12 if friday then 15:23')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-01-02 14:12:00',
        start: 'mon 2017-01-02 14:12',
        end: 'tue 2017-01-03 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('01-01 if sunday then next monday 14:12 if friday then 15:23 in 2016', function () {
      const fn = new DateFn('01-01 if sunday then next monday 14:12 if friday then 15:23')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-01-01 15:23:00',
        start: 'fri 2016-01-01 15:23',
        end: 'sat 2016-01-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Changes to different weekday', function () {
    it('wednesday before 11-23', function () {
      const fn = new DateFn('wednesday before 11-23')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-18 00:00:00',
        start: 'wed 2015-11-18 00:00',
        end: 'thu 2015-11-19 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('2nd sunday before 11-01', function () {
      const fn = new DateFn('2nd sunday before 11-01')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-10-18 00:00:00',
        start: 'sun 2015-10-18 00:00',
        end: 'mon 2015-10-19 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('2nd sunday after 11-01', function () {
      const fn = new DateFn('2nd sunday after 11-01')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-08 00:00:00',
        start: 'sun 2015-11-08 00:00',
        end: 'mon 2015-11-09 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('tuesday before 4th thursday after 11-01', function () {
      const fn = new DateFn('tuesday before 4th thursday after 11-01')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-24 00:00:00',
        start: 'tue 2015-11-24 00:00',
        end: 'wed 2015-11-25 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('tuesday before 2nd tuesday after 11-01', function () {
      const fn = new DateFn('tuesday before 2nd tuesday after 11-01')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-03 00:00:00',
        start: 'tue 2015-11-03 00:00',
        end: 'wed 2015-11-04 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('sunday after 4th thursday after 11-01', function () {
      const fn = new DateFn('sunday after 4th thursday after 11-01')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-29 00:00:00',
        start: 'sun 2015-11-29 00:00',
        end: 'mon 2015-11-30 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('1 day before 11-23', function () {
      const fn = new DateFn('1 day before 11-23')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-22 00:00:00',
        start: 'sun 2015-11-22 00:00',
        end: 'mon 2015-11-23 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Change to different weekday if date falls on a certain weekday', function () {
    it('01-01 if monday then next monday', function () {
      const fn = new DateFn('01-01 if monday then next monday')
      const res = fn.inYear(2018).get()
      const exp = [{
        date: '2018-01-08 00:00:00',
        start: 'mon 2018-01-08 00:00',
        end: 'tue 2018-01-09 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('01-01 if monday then next monday for 2015', function () {
      const fn = new DateFn('01-01 if monday then next monday')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-01-01 00:00:00',
        start: 'thu 2015-01-01 00:00',
        end: 'fri 2015-01-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('01-01 if friday then previous monday', function () { // FIXME reprocess with 2015
      const fn = new DateFn('01-01 if friday then previous monday')
      const res = fn.inYear(2016).get() // FIXME date is not catched in 2015
      const exp = []
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('01-01 if sunday then previous monday for 2016', function () {
      const fn = new DateFn('01-01 if sunday then previous monday')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-01-01 00:00:00',
        start: 'fri 2016-01-01 00:00',
        end: 'sat 2016-01-02 00:00'
      }, {
        date: '2016-12-26 00:00:00',
        start: 'mon 2016-12-26 00:00',
        end: 'tue 2016-12-27 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('01-01 if sunday then next sunday', function () {
      const fn = new DateFn('01-01 if sunday then next sunday')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-01-08 00:00:00',
        start: 'sun 2017-01-08 00:00',
        end: 'mon 2017-01-09 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('03-06 if sunday then previous sunday', function () {
      const fn = new DateFn('03-06 if sunday then previous sunday')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-02-28 00:00:00',
        start: 'sun 2016-02-28 00:00',
        end: 'mon 2016-02-29 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('substitutes 01-01 if sunday then next tuesday in 2017', function () {
      const fn = new DateFn('substitutes 01-01 if sunday then next tuesday')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-01-03 00:00:00',
        start: 'tue 2017-01-03 00:00',
        end: 'wed 2017-01-04 00:00',
        substitute: true
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('substitutes 05-03 if sunday then next wednesday in 2015', function () {
      const holidays = {
        'substitutes 05-03 if sunday then next wednesday': {
          substitute: true
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn('substitutes 05-03 if sunday then next wednesday', holidays)
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-05-06 00:00:00',
        start: 'wed 2015-05-06 00:00',
        end: 'thu 2015-05-07 00:00',
        substitute: true
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
    it('substitutes 01-01 if sunday then next tuesday in 2016', function () {
      const fn = new DateFn('substitutes 01-01 if sunday then next tuesday')
      const res = fn.inYear(2016).get()
      assert.ok(!res.length)
    })

    it('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday in 2016', function () {
      const fn = new DateFn('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-07-11 00:00:00 -0600',
        start: 'sun 2016-07-10 18:00',
        end: 'mon 2016-07-11 18:00',
        substitute: true
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday in 2018', function () {
      const fn = new DateFn('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday')
      const res = fn.inYear(2018).get()
      assert.ok(!res.length)
    })

    it('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday 2015', function () {
      const fn = new DateFn('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-10-12 00:00:00',
        start: 'mon 2015-10-12 00:00',
        end: 'tue 2015-10-13 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday 2016', function () {
      const fn = new DateFn('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-10-10 00:00:00',
        start: 'mon 2016-10-10 00:00',
        end: 'tue 2016-10-11 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday 2017', function () {
      const fn = new DateFn('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-10-16 00:00:00',
        start: 'mon 2017-10-16 00:00',
        end: 'tue 2017-10-17 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('substitutes 04-02 if tuesday then previous monday if thursday then next friday 2015', function () {
      const fn = new DateFn('substitutes 04-02 if tuesday then previous monday if thursday then next friday')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-04-03 00:00:00',
        start: 'fri 2015-04-03 00:00',
        end: 'sat 2015-04-04 00:00',
        substitute: true
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('substitutes 04-02 if tuesday then previous monday if thursday then next friday 2016', function () {
      const fn = new DateFn('substitutes 04-02 if tuesday then previous monday if thursday then next friday')
      const res = fn.inYear(2016).get()
      const exp = []
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Observe up to 2 holidays if date falls on a certain weekday', function () {
    it('01-01 and if monday then next monday for 2018', function () {
      const fn = new DateFn('01-01 and if monday then next monday')
      const res = fn.inYear(2018).get()
      const exp = [{
        date: '2018-01-01 00:00:00',
        start: 'mon 2018-01-01 00:00',
        end: 'tue 2018-01-02 00:00'
      }, {
        date: '2018-01-08 00:00:00',
        start: 'mon 2018-01-08 00:00',
        end: 'tue 2018-01-09 00:00',
        substitute: true
      }]
      // log(fixResult(res))
      assert.deepStrictEqual(fixResult(res), exp)
    })
    it('01-01 and if monday then next monday for 2017', function () {
      const fn = new DateFn('01-01 and if monday then next monday')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-01-01 00:00:00',
        start: 'sun 2017-01-01 00:00',
        end: 'mon 2017-01-02 00:00'
      }]
      // log(fixResult(res))
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('4 Shawwal and if saturday then next monday for 2016', function () {
      const fn = new DateFn('4 Shawwal and if saturday then next monday')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-07-09 00:00:00 -0600',
        start: 'fri 2016-07-08 18:00',
        end: 'sat 2016-07-09 18:00'
      }, {
        date: '2016-07-11 00:00:00 -0600',
        start: 'sun 2016-07-10 18:00',
        end: 'mon 2016-07-11 18:00',
        substitute: true
      }]
      // log(fixResult(res))
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('4 Shawwal and if saturday then next monday for 2017', function () {
      const fn = new DateFn('4 Shawwal and if saturday then next monday')
      const res = fn.inYear(2017).get()
      const exp = [{
        date: '2017-06-28 00:00:00 -0600',
        start: 'tue 2017-06-27 18:00',
        end: 'wed 2017-06-28 18:00'
      }]
      // log(fixResult(res))
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('02-06 and if saturday then previous friday if sunday then next monday in 2016', function () {
      const fn = new DateFn('02-06 14:00 and if saturday then previous friday 16:45 if sunday then next monday PT12H')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-02-06 14:00:00',
        start: 'sat 2016-02-06 14:00',
        end: 'sun 2016-02-07 00:00'
      }, {
        date: '2016-02-05 16:45:00',
        start: 'fri 2016-02-05 16:45',
        end: 'sat 2016-02-06 00:00',
        substitute: true
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('02-07 and if saturday then previous friday 16:45 if sunday then next monday 12:21 in 2016', function () {
      const fn = new DateFn('02-07 and if saturday then previous friday 16:45 if sunday then next monday PT12H')
      const res = fn.inYear(2016).get()
      const exp = [{
        date: '2016-02-07 00:00:00',
        start: 'sun 2016-02-07 00:00',
        end: 'mon 2016-02-08 00:00'
      }, {
        date: '2016-02-08 00:00:00',
        start: 'mon 2016-02-08 00:00',
        end: 'mon 2016-02-08 12:00',
        substitute: true
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Enable Date only for certain years', function () {
    it('11-01 in even years', function () {
      const fn = new DateFn('11-01 in even years')
      const res = fn.inYear(2014).get()
      const exp = [{
        date: '2014-11-01 00:00:00',
        start: 'sat 2014-11-01 00:00',
        end: 'sun 2014-11-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 in even years for 2015', function () {
      const fn = new DateFn('11-01 in even years')
      const res = fn.inYear(2015).get()
      assert.ok(res.length === 0)
    })

    it('11-01 in odd years', function () {
      const fn = new DateFn('11-01 in odd years')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-01 00:00:00',
        start: 'sun 2015-11-01 00:00',
        end: 'mon 2015-11-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 in odd years for 2014', function () {
      const fn = new DateFn('11-01 in odd years')
      const res = fn.inYear(2014).get()
      assert.ok(res.length === 0)
    })

    it('11-01 in leap years for 2000', function () {
      const fn = new DateFn('11-01 in leap years')
      const res = fn.inYear(2000).get()
      const exp = [{
        date: '2000-11-01 00:00:00',
        start: 'wed 2000-11-01 00:00',
        end: 'thu 2000-11-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 in leap years for 2012', function () {
      const fn = new DateFn('11-01 in leap years')
      const res = fn.inYear(2012).get()
      const exp = [{
        date: '2012-11-01 00:00:00',
        start: 'thu 2012-11-01 00:00',
        end: 'fri 2012-11-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 in leap years for 2014', function () {
      const fn = new DateFn('11-01 in leap years')
      const res = fn.inYear(2014).get()
      assert.ok(res.length === 0)
    })

    it('11-01 in non-leap years for 2011', function () {
      const fn = new DateFn('11-01 in non-leap years')
      const res = fn.inYear(2011).get()
      const exp = [{
        date: '2011-11-01 00:00:00',
        start: 'tue 2011-11-01 00:00',
        end: 'wed 2011-11-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 in non-leap years for 2012', function () {
      const fn = new DateFn('11-01 in non-leap years')
      const res = fn.inYear(2012).get()
      assert.ok(res.length === 0)
    })

    it('tuesday after 1st monday after 11-01 in even years', function () {
      const fn = new DateFn('tuesday after 1st monday after 11-01 in even years')
      const res = fn.inYear(2014).get()
      const exp = [{
        date: '2014-11-04 00:00:00',
        start: 'tue 2014-11-04 00:00',
        end: 'wed 2014-11-05 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('tuesday after 1st monday after 11-01 in even years for 2015', function () {
      const fn = new DateFn('tuesday after 1st monday after 11-01 in even years')
      const res = fn.inYear(2015).get()
      assert.ok(res.length === 0)
    })

    it('tuesday after 1st monday after 11-01 in odd years', function () {
      const fn = new DateFn('tuesday after 1st monday after 11-01 in odd years')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-11-03 00:00:00',
        start: 'tue 2015-11-03 00:00',
        end: 'wed 2015-11-04 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('tuesday after 1st monday after 11-01 in odd years for 2014', function () {
      const fn = new DateFn('tuesday after 1st monday after 11-01 in odd years')
      const res = fn.inYear(2014).get()
      assert.ok(res.length === 0)
    })

    it('12-01 every 6 years since 1934', function () {
      const fn = new DateFn('12-01 every 6 years since 1934')
      const res = fn.inYear(2012).get()
      const exp = [{
        date: '2012-12-01 00:00:00',
        start: 'sat 2012-12-01 00:00',
        end: 'sun 2012-12-02 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('12-01 every 6 years since 1934 for 2011', function () {
      const fn = new DateFn('12-01 every 6 years since 1934')
      const res = fn.inYear(2011).get()
      assert.ok(res.length === 0)
    })
  })

  describe('Enable Date only for certain weekdays', function () {
    it('09-22 on sunday, saturday for 2013', function () {
      const fn = new DateFn('09-22 on sunday, saturday')
      const res = fn.inYear(2013).get()
      const exp = [{
        date: '2013-09-22 00:00:00',
        start: 'sun 2013-09-22 00:00',
        end: 'mon 2013-09-23 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('09-22 on sunday, saturday for 2015', function () {
      const fn = new DateFn('09-22 on sunday, saturday')
      const res = fn.inYear(2015).get()
      const exp = []
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('12-26 not on friday, monday for 2014', function () {
      const fn = new DateFn('12-26 not on friday, monday')
      const res = fn.inYear(2014).get() // is friday
      const exp = []
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('12-26 not on friday, monday for 2015', function () {
      const fn = new DateFn('12-26 not on friday, monday')
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-12-26 00:00:00',
        start: 'sat 2015-12-26 00:00',
        end: 'sun 2015-12-27 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('12-26 not on friday, monday for 2016', function () {
      const fn = new DateFn('12-26 not on friday, monday')
      const res = fn.inYear(2016).get() // is monday
      const exp = []
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('Bridge Days', function () {
    it('09-22 if 09-21 and 09-23 is public holiday', function () {
      const holidays = {
        '09-21': {
          type: 'public'
        },
        '09-22 if 09-21 and 09-23 is public holiday': {
          type: 'public'
        },
        '09-23': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn('09-22 if 09-21 and 09-23 is public holiday', holidays)
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-09-22 00:00:00',
        start: 'tue 2015-09-22 00:00',
        end: 'wed 2015-09-23 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('09-22 if 09-21 and 09-23 is public holiday where 09-23 is not a holiday', function () {
      const holidays = {
        '09-21': {
          type: 'public'
        },
        '09-22 if 09-21 and 09-23 is public holiday': {
          type: 'public'
        },
        '09-24': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn('09-22 if 09-21 and 09-23 is public holiday', holidays)
      const res = fn.inYear(2015).get()
      assert.ok(!res.length)
    })

    it('09-22 if 09-21 and 09-23 is public holiday where 09-23 is of type observance', function () {
      const holidays = {
        '09-21': {
          type: 'public'
        },
        '09-22 if 09-21 and 09-23 is public holiday': {
          type: 'public'
        },
        '09-23': {
          type: 'observance'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn('09-22 if 09-21 and 09-23 is public holiday', holidays)
      const res = fn.inYear(2015).get()
      assert.ok(!res.length)
    })

    it('09-22 if 09-21 is holiday', function () {
      const holidays = {
        '09-21': {
          type: 'public'
        },
        '09-22 if 09-21 is holiday': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn('09-22 if 09-21 is holiday', holidays)
      const res = fn.inYear(2015).get()
      const exp = [{
        date: '2015-09-22 00:00:00',
        start: 'tue 2015-09-22 00:00',
        end: 'wed 2015-09-23 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('09-22 if 09-21 is holiday (bad case)', function () {
      const holidays = {
        '09-20': {
          type: 'public'
        },
        '09-22 if 09-21 is holiday': {
          type: 'public'
        },
        '09-23': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn('09-22 if 09-21 is holiday', holidays)
      const res = fn.inYear(2015).get()
      assert.ok(!res.length)
    })
  })

  describe('Already a Holiday', function () {
    it('Thursday after 04-02 if is holiday then next Thursday', function () {
      const ruleStr = 'Thursday after 04-02 if is holiday then next Thursday'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '04-04': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2019).get()
      const exp = [{
        date: '2019-04-11 00:00:00',
        start: 'thu 2019-04-11 00:00',
        end: 'fri 2019-04-12 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)

      const res2018 = fn.inYear(2018).get()
      const exp2018 = [{
        date: '2018-04-05 00:00:00',
        start: 'thu 2018-04-05 00:00',
        end: 'fri 2018-04-06 00:00'
      }]
      assert.deepStrictEqual(fixResult(res2018), exp2018)
    })

    it('Thursday after 04-02 if is holiday then 3rd next Thursday', function () {
      const ruleStr = 'Thursday after 04-02 if is holiday then 3rd next Thursday'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '04-04': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2019).get()
      const exp = [{
        date: '2019-04-25 00:00:00',
        start: 'thu 2019-04-25 00:00',
        end: 'fri 2019-04-26 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('Thursday after 04-02 if is holiday then previous Thursday', function () {
      const ruleStr = 'Thursday after 04-02 if is holiday then previous Thursday'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '04-04': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2019).get()
      const exp = [{
        date: '2019-03-28 00:00:00',
        start: 'thu 2019-03-28 00:00',
        end: 'fri 2019-03-29 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('Thursday after 04-02 if is holiday then 3rd previous Thursday', function () {
      const ruleStr = 'Thursday after 04-02 if is holiday then 3rd previous Thursday'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '04-04': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2019).get()
      const exp = [{
        date: '2019-03-14 00:00:00',
        start: 'thu 2019-03-14 00:00',
        end: 'fri 2019-03-15 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('04-03 if is holiday then 3rd next day omit Saturday, Sunday', function () {
      const ruleStr = '04-03 if is holiday then 3rd next day omit Saturday, Sunday'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '04-03': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2019).get()
      const exp = [{
        date: '2019-04-08 00:00:00',
        start: 'mon 2019-04-08 00:00',
        end: 'tue 2019-04-09 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)

      const res2020 = fn.inYear(2020).get()
      const exp2020 = [{
        date: '2020-04-06 00:00:00',
        start: 'mon 2020-04-06 00:00',
        end: 'tue 2020-04-07 00:00'
      }]
      assert.deepStrictEqual(fixResult(res2020), exp2020)
    })

    it('04-03 if is holiday then 3rd previous day omit Saturday, Sunday', function () {
      const ruleStr = '04-03 if is holiday then 3rd previous day omit Saturday, Sunday'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '04-03': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2019).get()
      const exp = [{
        date: '2019-03-29 00:00:00',
        start: 'fri 2019-03-29 00:00',
        end: 'sat 2019-03-30 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)

      const res2020 = fn.inYear(2020).get()
      const exp2020 = [{
        date: '2020-03-31 00:00:00',
        start: 'tue 2020-03-31 00:00',
        end: 'wed 2020-04-01 00:00'
      }]
      assert.deepStrictEqual(fixResult(res2020), exp2020)
    })

    it('03-07 and if Saturday, Sunday then next Monday if is holiday then 2nd next Tuesday since 2022', function () {
      const ruleStr = '03-07 and if Saturday, Sunday then next Monday if is holiday then 2nd next Tuesday since 2022'
      const holidays = {
        [ruleStr]: {
          type: 'public'
        },
        '03-07': {
          type: 'public'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const fn = new DateFn(ruleStr, holidays)
      const res = fn.inYear(2022).get()
      const exp = [{
        date: '2022-03-15 00:00:00',
        start: 'tue 2022-03-15 00:00',
        end: 'wed 2022-03-16 00:00'
      }]
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('disable-enable rules', function () {
    it('11-01 disabled in 2015', function () {
      const holidays = {
        '11-01': {
          disable: ['2015-11-01']
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = []
      const fn = new DateFn('11-01', holidays)
      const res = fn.inYear(2015).get()
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 disabled in 2016', function () {
      const holidays = {
        '11-01': {
          disable: ['2015-11-01']
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = [{
        date: '2016-11-01 00:00:00',
        start: 'tue 2016-11-01 00:00',
        end: 'wed 2016-11-02 00:00'
      }]
      const fn = new DateFn('11-01', holidays)
      const res = fn.inYear(2016).get()
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('11-01 disabled in 2015 but moved to different date', function () {
      const holidays = {
        '11-01': {
          disable: ['2015-11-01'],
          enable: ['2015-11-03']
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = [{
        date: '2015-11-03 00:00:00',
        start: 'tue 2015-11-03 00:00',
        end: 'wed 2015-11-04 00:00'
      }]
      const fn = new DateFn('11-01', holidays)
      const res = fn.inYear(2015).get()
      assert.deepStrictEqual(fixResult(res), exp)
    })

    it('4th monday after 11-01', function () {
      const holidays = {
        '4th monday after 11-01': {
          disable: ['2015-11-23'],
          enable: ['2015-11-27']
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = [{
        date: '2015-11-27 00:00:00',
        start: 'fri 2015-11-27 00:00',
        end: 'sat 2015-11-28 00:00'
      }]
      const fn = new DateFn('4th monday after 11-01', holidays)
      const res = fn.inYear(2015).get()
      assert.deepStrictEqual(fixResult(res), exp)
    })
  })

  describe('since / prior to rules', function () {
    it('11-01 prior to 2015', function () {
      const rule = '11-01 prior to 2015'
      const holidays = {
        [rule]: {
          name: '<2015'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = [{
        date: '2014-11-01 00:00:00',
        start: 'sat 2014-11-01 00:00',
        end: 'sun 2014-11-02 00:00'
      }]
      const res = holidays[rule].fn.inYear(2014).get()
      assert.deepStrictEqual(fixResult(res), exp)

      const exp2 = []
      const res2 = holidays[rule].fn.inYear(2015).get()
      assert.deepStrictEqual(fixResult(res2), exp2)
    })

    it('since year', function () {
      const holidays = {
        '11-01 prior to 2010': {
          name: '>2010'
        },
        '11-01 since 2010': {
          name: '>=2010'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = [
        [{
          date: '2005-11-01 00:00:00',
          start: 'tue 2005-11-01 00:00',
          end: 'wed 2005-11-02 00:00'
        }],
        []
      ]
      const res = Object.keys(holidays).map(rule => holidays[rule].fn.inYear(2005).get())
      assert.deepStrictEqual(res.map(fixResult), exp)

      const exp2 = [
        [],
        [{
          date: '2010-11-01 00:00:00',
          start: 'mon 2010-11-01 00:00',
          end: 'tue 2010-11-02 00:00'
        }]
      ]
      const res2 = Object.keys(holidays).map(rule => holidays[rule].fn.inYear(2010).get())
      assert.deepStrictEqual(res2.map(fixResult), exp2)
    })

    it('since year and prior to year in 2005', function () {
      const holidays = {
        '11-01 prior to 2010': {
          name: '<2010'
        },
        '11-01 since 2010 and prior to 2015': {
          name: '<2015'
        }
      }
      Object.keys(holidays).forEach((rule) => {
        holidays[rule].fn = new DateFn(rule, holidays)
      })
      const exp = [
        [
          {
            date: '2005-11-01 00:00:00',
            end: 'wed 2005-11-02 00:00',
            start: 'tue 2005-11-01 00:00'
          }
        ],
        []
      ]
      const res = Object.keys(holidays).map(rule => holidays[rule].fn.inYear(2005).get())
      assert.deepStrictEqual(res.map(fixResult), exp)
    })
  })
})
