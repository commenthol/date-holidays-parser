/* eslint
   no-spaced-func: 0,
   no-unexpected-multiline: 0
 */

import { toNumber } from './internal/utils.js'

const WEEKDAYS = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|')

const lowerCaseWeekday = (weekday) => WEEKDAYS.includes(weekday) ? weekday.toLowerCase() : weekday

const lowerCaseWeekdayWithoutDay = weekday => (weekday === 'day')
  ? undefined
  : lowerCaseWeekday(weekday)

/**
 * regular expressions to parse holiday statements
 */
const grammar = (function () {
  /**
   * combines different regexes
   * @private
   * @return {RegExp} combined regex
   */
  function replace (regex, opt) {
    regex = regex.source
    opt = opt || ''
    return function self (name, val) {
      if (!name) return new RegExp(regex, opt)
      val = val.source || val
      val = val.replace(/(^|[^[])\^/g, '$1')
      regex = regex.replace(name, val)
      return self
    }
  }

  // raw rules
  const raw = {
    _weekdays: '[Ss]unday|[Mm]onday|[Tt]uesday|[Ww]ednesday|[Tt]hursday|[Ff]riday|[Ss]aturday|day',
    _months: 'January|February|March|April|May|June|July|August|September|October|November|December',
    _islamicMonths: 'Muharram|Safar|Rabi al-awwal|Rabi al-thani|Jumada al-awwal|Jumada al-thani|Rajab|Shaban|Ramadan|Shawwal|Dhu al-Qidah|Dhu al-Hijjah',
    _hebrewMonths: 'Nisan|Iyyar|Sivan|Tamuz|Av|Elul|Tishrei|Cheshvan|Kislev|Tevet|Shvat|AdarII|Adar',
    _jalaaliMonths: 'Farvardin|Ordibehesht|Khordad|Tir|Mordad|Shahrivar|Mehr|Aban|Azar|Dey|Bahman|Esfand',
    _days: /(_weekdays)s?/,
    _direction: /(before|after|next|previous|in)/,
    _counts: /(\d+)(?:st|nd|rd|th)?/,
    _count_days: /([-+]?\d{1,2}) ?(?:days?|d)?/,
    _timezone: / in ([^\s]*|[+-]\d{2}:\d{2})/,
    _type: /(public|bank|school|observance|optional)/,

    dateMonth: /^(_months)/,
    date: /^(?:0*(\d{1,4})-)?0?(\d{1,2})-0?(\d{1,2})/,
    time: /^(?:T?0?(\d{1,2}):0?(\d{1,2})|T0?(\d{1,2}))/,
    duration: /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/, // follows ISO 8601

    julian: /^julian date/,
    easter: /^(easter|orthodox)(?: _count_days)?/,
    equinox: /^([Mm]arch|[Jj]une|[Ss]eptember|[Dd]ecember) (?:equinox|solstice)(?:_timezone)?/,
    hebrew: /^0?(\d{1,2}) (_hebrewMonths)(?: 0*(\d{1,}))?/,
    islamic: /^0?(\d{1,2}) (_islamicMonths)(?: 0*(\d{1,}))?/,
    jalaali: /^0?(\d{1,2}) (_jalaaliMonths)(?: 0*(\d{1,}))?/,
    chineseLunar: /^(chinese|korean|vietnamese) (?:(\d+)-(\d{1,2})-)?(\d{1,2})-([01])-(\d{1,2})/,
    chineseSolar: /^(chinese|korean|vietnamese) (?:(\d+)-(\d{1,2})-)?(\d{1,2})-(\d{1,2}) solarterm/,
    bengaliRevised: /^(bengali-revised) (?:-?0*(\d{1,4})-)?0?(\d{1,2})-0?(\d{1,2})/,

    modifier: /^(substitutes|and|if equal|then|if)\b/,
    rule_year: /^(?:in (even|odd|leap|non-leap) years|every (\d+) years? since 0*(\d{1,4}))/,
    rule_weekday: /(not )?on ((?:(?:_weekdays)(?:,\s?)?)*)/,
    rule_date_if_then: /^if ((?:(?:_weekdays)(?:,\s?)?)*) then (?:_direction _days)?/,
    rule_day_dir_date: /^(?:_counts )?_days _direction/,
    rule_bridge: /^is (?:_type )?holiday/,
    rule_if_holiday: /^if is (?:_type )?holiday then (?:_counts )?(?:_direction _days)?(?: omit ((?:(?:_weekdays)(?:,\s?)?)*))?/,
    rule_same_day: /^#\d+/,
    rule_active_from: /^since (0*\d{1,4})(?:-0*(\d{1,2})(?:-0*(\d{1,2})|)|)(?: and|)/,
    rule_active_to: /^prior to (0*\d{1,4})(?:-0*(\d{1,2})(?:-0*(\d{1,2})|)|)/,

    // rule_type_if_then: /if ((?:(?:_weekdays)(?:,\s?)?)*) then/,
    // rule_type_dir: /_days _direction$/,
    // rule_type_bridge: / if .* is .* holiday$/,

    space: /^\s+/
  }
  /* eslint-disable func-call-spacing */
  raw._days = replace(raw._days)
  (/_weekdays/, raw._weekdays)
  ()
  raw.julian = replace(raw.julian, '')
  (/date/, raw.date)
  ()
  raw.easter = replace(raw.easter, '')
  (/_count_days/, raw._count_days)
  ()
  raw.equinox = replace(raw.equinox, '')
  (/_count_days/g, raw._count_days)
  (/_direction/g, raw._direction)
  (/_timezone/g, raw._timezone)
  ()
  raw.hebrew = replace(raw.hebrew, '')
  (/_hebrewMonths/, raw._hebrewMonths)
  ()
  raw.islamic = replace(raw.islamic, '')
  (/_islamicMonths/, raw._islamicMonths)
  ()
  raw.jalaali = replace(raw.jalaali, '')
  (/_jalaaliMonths/, raw._jalaaliMonths)
  ()
  raw.dateMonth = replace(raw.dateMonth)
  (/_months/, raw._months)
  ()

  raw.rule_weekday = replace(raw.rule_weekday, '')
  (/_weekdays/g, raw._weekdays)
  ()
  raw.rule_date_if_then = replace(raw.rule_date_if_then, '')
  (/_direction/g, raw._direction)
  (/_weekdays/g, raw._weekdays)
  (/_days/g, raw._days)
  ()
  raw.rule_bridge = replace(raw.rule_bridge, '')
  (/_type/g, raw._type)
  ()
  raw.rule_if_holiday = replace(raw.rule_if_holiday, '')
  (/_type/g, raw._type)
  (/_counts/g, raw._counts)
  (/_direction/g, raw._direction)
  (/_days/g, raw._days)
  (/_weekdays/g, raw._weekdays)
  ()
  raw.rule_day_dir_date = replace(raw.rule_day_dir_date, '')
  (/_counts/, raw._counts)
  (/_days/g, raw._days)
  (/_direction/g, raw._direction)
  ()
  // raw.rule_type_if_then = replace(raw.rule_type_if_then, '')
  // (/_direction/g, raw._direction)
  // (/_days/g, raw._days)
  // ()

  let i = 1
  raw.months = {}
  raw._months.split('|').forEach(function (m) {
    raw.months[m] = i++
  })

  i = 1
  raw.islamicMonths = {}
  raw._islamicMonths.split('|').forEach(function (m) {
    raw.islamicMonths[m] = i++
  })

  i = 1
  raw.hebrewMonths = {}
  raw._hebrewMonths.split('|').forEach(function (m) {
    raw.hebrewMonths[m] = i++
  })
  // parser regex needs larger string before shorter AdarII and Adar pos needs correction
  raw.hebrewMonths.Adar = 12
  raw.hebrewMonths.AdarII = 13

  i = 1
  raw.jalaaliMonths = {}
  raw._jalaaliMonths.split('|').forEach(function (m) {
    raw.jalaaliMonths[m] = i++
  })

  return raw
  /* eslint-enable */
})()

// console.log(grammar)

export default class Parser {
  constructor (fns) {
    this.fns = fns || [
      '_julian',
      '_date',
      '_easter',
      '_islamic',
      '_hebrew',
      '_jalaali',
      '_equinox',
      '_chineseSolar',
      '_chineseLunar',
      '_bengaliRevised',
      '_dateMonth',
      '_ruleDateIfThen',
      '_ruleWeekday',
      '_ruleYear',
      '_ruleDateDir',
      '_ruleIfHoliday',
      '_ruleBridge',
      '_ruleTime',
      '_ruleDuration',
      '_ruleModifier',
      '_ruleSameDay',
      '_ruleActiveFrom',
      '_ruleActiveTo'
    ]
    this.tokens = []
  }

  parse (rule) {
    this.setup = { str: rule, rule }
    this.error = 0
    this.tokens = []
    this._tokenize(this.setup)
    this._reorder()
    return this.tokens
  }

  /**
   * reorder set of tokens for rule dateDir
   * dateDir: [dateDir2, dateDir1, fn] --> [fn, dateDir1, dateDir2]
   * dateIfThen: [fn, dateIfThen1, dateIfThen2] --> [fn, dateIfThen1, dateIfThen2]
   */
  _reorder () {
    const tmp = []
    const res = []

    this.tokens.forEach((token) => {
      if (token.rule === 'dateDir') {
        tmp.push(token)
      } else {
        res.push(token)
        if (tmp.length) {
          while (tmp.length) {
            res.push(tmp.pop())
          }
        }
      }

      // no modifiers before a date
      if (token.fn && res[0].modifier) {
        while (res[0].modifier) {
          res.push(res.shift())
        }
      }
    })
    this.tokens = res
  }

  _tokenize (o) {
    let last
    while (o.str) {
      for (let i = 0; i < this.fns.length; i++) {
        if (this[this.fns[i]](o)) break
      }
      this._space(o)
      if (last === o.str) {
        this.error++
        break
      }
      last = o.str
    }
  }

  _shorten (o, cap0) {
    o.str = o.str.substr(cap0.length, o.str.length)
  }

  _date (o) {
    let cap
    if ((cap = grammar.date.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'gregorian',
        year: toNumber(cap.shift()),
        month: toNumber(cap.shift()),
        day: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _julian (o) {
    let cap
    if ((cap = grammar.julian.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'julian',
        year: toNumber(cap.shift()),
        month: toNumber(cap.shift()),
        day: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _easter (o) {
    let cap
    if ((cap = grammar.easter.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'easter',
        type: cap.shift(),
        offset: toNumber(cap.shift()) || 0
      }
      this.tokens.push(res)
      return true
    }
  }

  _equinox (o) {
    let cap
    if ((cap = grammar.equinox.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'equinox',
        season: cap.shift().toLowerCase(),
        timezone: cap.shift() || 'GMT'
      }
      this.tokens.push(res)
      return true
    }
  }

  _hebrew (o) {
    let cap

    if ((cap = grammar.hebrew.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'hebrew',
        day: toNumber(cap.shift()),
        month: grammar.hebrewMonths[cap.shift()],
        year: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _islamic (o) {
    let cap
    if ((cap = grammar.islamic.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'islamic',
        day: toNumber(cap.shift()),
        month: grammar.islamicMonths[cap.shift()],
        year: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _jalaali (o) {
    let cap
    if ((cap = grammar.jalaali.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'jalaali',
        day: toNumber(cap.shift()),
        month: grammar.jalaaliMonths[cap.shift()],
        year: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _chineseSolar (o) {
    let cap
    if ((cap = grammar.chineseSolar.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: cap.shift(),
        cycle: toNumber(cap.shift()),
        year: toNumber(cap.shift()),
        solarterm: toNumber(cap.shift()),
        day: toNumber(cap.shift()),
        timezone: cap.shift()
      }
      this.tokens.push(res)
      return true
    }
  }

  _chineseLunar (o) {
    let cap
    if ((cap = grammar.chineseLunar.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: cap.shift(),
        cycle: toNumber(cap.shift()),
        year: toNumber(cap.shift()),
        month: toNumber(cap.shift()),
        leapMonth: !!toNumber(cap.shift()),
        day: toNumber(cap.shift()),
        timezone: cap.shift()
      }
      this.tokens.push(res)
      return true
    }
  }

  _bengaliRevised (o) {
    let cap
    if ((cap = grammar.bengaliRevised.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: cap.shift(),
        year: toNumber(cap.shift()),
        month: toNumber(cap.shift()),
        day: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _dateMonth (o) {
    let cap
    if ((cap = grammar.dateMonth.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        fn: 'gregorian',
        day: 1,
        month: grammar.months[cap.shift()],
        year: undefined
      }
      this.tokens.push(res)
      return true
    }
  }

  _space (o) {
    let cap
    if ((cap = grammar.space.exec(o.str))) {
      this._shorten(o, cap[0])
      return true
    }
  }

  _ruleSameDay (o) {
    let cap
    if ((cap = grammar.rule_same_day.exec(o.str))) {
      this._shorten(o, cap[0])
      return true
    }
  }

  _ruleModifier (o) {
    let cap
    if ((cap = grammar.modifier.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        modifier: cap.shift()
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleTime (o) {
    let cap
    if ((cap = grammar.time.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'time',
        hour: toNumber(cap.shift()) || 0,
        minute: toNumber(cap.shift()) || 0
      }
      res.hour = res.hour || toNumber(cap.shift()) || 0
      this.tokens.push(res)
      return true
    }
  }

  _ruleDuration (o) {
    let cap
    if ((cap = grammar.duration.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const tmp = {
        days: toNumber(cap.shift()) || 0,
        hours: toNumber(cap.shift()) || 0,
        minutes: toNumber(cap.shift()) || 0
      }
      const res = {
        rule: 'duration',
        // duration is calculated in hours
        duration: (tmp.days * 24) + tmp.hours + (tmp.minutes / 60)
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleDateIfThen (o) {
    let cap
    if ((cap = grammar.rule_date_if_then.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'dateIfThen',
        if: (cap.shift()).split(/(?:,\s?)/).map(lowerCaseWeekday),
        direction: cap.shift(),
        then: lowerCaseWeekday(cap.shift())
      }
      // create a sub-parser to only check for time, duration
      const p = new Parser(['_ruleTime', '_ruleDuration'])
      p.parse(o.str)
      if (p.tokens.length) {
        res.rules = p.tokens
      }
      o.str = ' ' + p.setup.str // ' ' required such that the _tokenize function finalizes the loop
      this.tokens.push(res)
      return true
    }
  }

  _ruleWeekday (o) {
    let cap
    if ((cap = grammar.rule_weekday.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'weekday',
        not: !!cap.shift(),
        if: (cap.shift()).split(/(?:,\s?)/).map(lowerCaseWeekday)
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleDateDir (o) {
    let cap
    if ((cap = grammar.rule_day_dir_date.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'dateDir',
        count: toNumber(cap.shift()) || 1,
        weekday: lowerCaseWeekday(cap.shift()),
        direction: cap.shift()
      }
      if (res.direction === 'in') {
        res.direction = 'after'
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleYear (o) {
    let cap
    if ((cap = grammar.rule_year.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'year',
        cardinality: cap.shift(),
        every: toNumber(cap.shift()),
        since: toNumber(cap.shift())
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleIfHoliday (o) {
    let cap
    if ((cap = grammar.rule_if_holiday.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'ruleIfHoliday',
        type: cap.shift(),
        count: toNumber(cap.shift()) || 1,
        direction: cap.shift(),
        weekday: lowerCaseWeekday(cap.shift()),
        omit: (cap.shift() || '').split(/(?:,\s?)/).map(lowerCaseWeekdayWithoutDay).filter(Boolean)
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleBridge (o) {
    let cap
    if ((cap = grammar.rule_bridge.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'bridge',
        type: cap.shift()
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleActiveFrom (o) {
    let cap
    if ((cap = grammar.rule_active_from.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'activeFrom',
        year: toNumber(cap.shift()),
        month: toNumber(cap.shift()) || 1,
        day: toNumber(cap.shift()) || 1
      }
      this.tokens.push(res)
      return true
    }
  }

  _ruleActiveTo (o) {
    let cap
    if ((cap = grammar.rule_active_to.exec(o.str))) {
      this._shorten(o, cap[0])
      cap.shift()
      const res = {
        rule: 'activeTo',
        year: toNumber(cap.shift()),
        month: toNumber(cap.shift()) || 1,
        day: toNumber(cap.shift()) || 1
      }
      this.tokens.push(res)
      return true
    }
  }
}
