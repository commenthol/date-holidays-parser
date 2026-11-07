/**
 * @copyright 2016- (c) commenthol
 * @license ISC
 */

import CalDate from 'caldate'
import _ from './utils.js'
import { toYear, toDate } from './internal/utils.js'
import Data from './Data.js'
import DateFn from './DateFn.js'
import { HolidayRule } from './HolidayRule.js'

/** @typedef {import('./types.js').HolidayOptions} HolidayOptions */
/** @typedef {import('./types.js').HolidayRuleOptions} HolidayRuleOptions */
/** @typedef {import('./types.js').Holiday} Holiday */
/** @typedef {import('./types.js').Location} Location */
/** @typedef {import('./types.js').HolidayMap} HolidayMap */

// priority in ascending order (low ... high)
const TYPES = ['observance', 'optional', 'school', 'bank', 'public']

/**
 * @class
 * @param {object} data - holiday data object - see data/holidays.json
 * @param {string|Location} [country] - country code or location object
 * @param {string} [state] - specifies state
 * @param {string} [region] - specifies region
 * @param {HolidayOptions} [opts] - options
 * @example
 * ```js
 * new Holiday(data, 'US', 'la', 'no') // is the same as
 * new Holiday(data, 'us.la.no')       // is the same as
 * new Holiday(data, { country: 'us', state: 'la', region: 'no'})
 * ```
 */
export class Holidays {
  constructor(data, country, state, region, opts) {
    if (!data) {
      throw new TypeError('need holiday data')
    }
    this._data = data
    this.init(country, state, region, opts)
  }

  /**
   * initialize holidays for a country/state/region
   * @param {string|Location|HolidayOptions} [country]
   * @param {string|HolidayOptions} [state]
   * @param {string|HolidayOptions} [region]
   * @param {HolidayOptions} [opts]
   */
  init(country, state, region, opts) {
    ;[country, state, region, opts] = getArgs(country, state, region, opts)

    // reset settings
    this.__conf = null
    this.__types = opts.types && opts.types.length ? opts.types : TYPES
    /** @type {HolidayMap} */
    this.holidays = {}
    this.setLanguages()

    this.__conf = Data.splitName(country, state, region)
    this.__data = new Data(opts.data || this._data, this.__conf)

    if (opts.languages) {
      this.setLanguages(opts.languages)
    } else {
      this.setLanguages(this.__data.getLanguages(this.__conf))
    }

    const holidays = this.__data.getRules()
    if (holidays) {
      this.__timezone = opts.timezone || this.__data.getTimezones()[0]
      Object.keys(holidays).forEach((rule) => {
        this.setHoliday(rule, holidays[rule])
      })
      return true
    }
  }

  /**
   * set (custom) holiday
   * @throws {TypeError}
   * @param {string} rule - rule for holiday or date in ISO format
   * @param {HolidayOptions|string|false} [opts] - holiday options or a name; `false` removes a rule
   * @returns {boolean} whether the holiday could be set
   */
  setHoliday(rule, opts) {
    // remove days
    if (opts === false) {
      if (this.holidays[rule]) {
        this.holidays[rule] = false
        return true
      }
      return false
    }

    // assign a name to rule
    /** @type {HolidayOptions} */
    let holidayOptions
    if (!opts || typeof opts === 'string') {
      const name = opts || rule
      const lang = this.getLanguages()[0]
      holidayOptions = _.set({ type: 'public' }, ['name', lang], name)
    } else {
      holidayOptions = opts
    }

    // convert active properties to Date
    if (holidayOptions.active) {
      if (!Array.isArray(holidayOptions.active)) {
        throw TypeError('.active is not of type Array: ' + rule)
      }
      holidayOptions.active = holidayOptions.active.map((a) => {
        const from = toDate(a.from)
        const to = toDate(a.to)
        if (!(from || to)) {
          throw TypeError('.active needs .from or .to property: ' + rule)
        }
        return { from, to }
      })
    }

    // check for supported type
    if (!this.__types.includes(holidayOptions.type)) {
      return false
    }

    this.holidays[rule] = holidayOptions

    const fn = new DateFn(rule, this.holidays)
    if (fn.ok) {
      holidayOptions.fn = fn
      return true
    } else {
      // throw Error('could not parse rule: ' + rule) // NEXT
      console.error('could not parse rule: ' + rule)
    }
    return false
  }

  /**
   * get all holidays for `year` with names using preferred `language`
   * @param {number|string|Date} [year] - if omitted, the current year is chosen
   * @param {string} [language] - ISO 639-1 code for language
   * @returns {Holiday[]} of found holidays in given year sorted by date
   * ```
   * {String} date - ISO Date String of (start)-date in local format
   * {Date} start - start date of holiday
   * {Date} end - end date of holiday
   * {String} name - name of holiday using `language` (if available)
   * {String} type - type of holiday `public|bank|school|observance`
   * ```
   */
  getHolidays(year, language) {
    const targetYear = toYear(year)
    if (targetYear === undefined) return []

    const langs = this.getLanguages()
    if (language) {
      langs.unshift(language)
    }

    const startSorter = (a, b) => +a.start - +b.start
    const typeIndex = (a) => this.__types.indexOf(a.type)
    const typeSorter = (a, b) => typeIndex(b) - typeIndex(a)
    const ruleIndex = (a) => (/substitutes|and if /.test(a.rule) ? 1 : 0)
    const ruleLength = (a) => String(a.rule || '').length
    const ruleSorter = (a, b) =>
      ruleIndex(a) - ruleIndex(b) || ruleLength(a) - ruleLength(b)

    const filterMap = {}

    const arr = Object.keys(this.holidays)
      .reduce((arr, rule) => {
        const holiday = this.holidays[rule]
        if (holiday && holiday.fn) {
          this._dateByRule(targetYear, rule).forEach((o) => {
            arr.push({ ...this._translate(o, langs), rule })
          })
        }
        return arr
      }, [])
      // sort by date and type to filter by duplicate
      .sort((a, b) => startSorter(a, b) || typeSorter(a, b) || ruleSorter(a, b))
      .filter((item) => {
        const hash = item.name + +item.start
        if (!filterMap[hash]) {
          filterMap[hash] = true
          return true
        }
        return false
      })

    return arr
  }

  /**
   * check whether `date` is a holiday or not
   * @param {Date|string} [date]
   * @returns {Holiday[]|false} holiday:
   * ```
   * {String} date - ISO Date String of (start)-date in local format
   * {Date} start - start date of holiday
   * {Date} end - end date of holiday
   * {String} name - name of holiday using `language` (if available)
   * {String} type - type of holiday `public|bank|school|observance`
   * ```
   */
  isHoliday(date) {
    date = date ? new Date(date) : new Date()
    const d = new CalDate()
    d.fromTimezone(date, this.__timezone)
    const year = d.year
    const rules = Object.keys(this.holidays)
    const days = []
    for (const rule of rules) {
      const hd = [].concat(this._dateByRule(year, rule))
      for (const hdrule of hd) {
        if (hdrule && date >= hdrule.start && date < hdrule.end) {
          days.push(this._translate(hdrule))
        }
      }
    }
    return days.length ? days : false
  }

  /**
   * set or update rule
   * @param {HolidayRuleOptions} holidayRule
   * @returns {boolean} `true` if holiday could be set, returns `true`
   */
  setRule(holidayRule) {
    const { rule, ...opts } = holidayRule
    return this.setHoliday(rule, opts)
  }

  /**
   * unset rule
   * @param {String} rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31st Dec
   * @returns {boolean} `true` if holiday could be set, returns `true`
   */
  unsetRule(rule) {
    return this.setHoliday(rule, false)
  }

  /**
   * get available rules for selected country, (state, region)
   * @returns {HolidayRule[]}
   */
  getRules() {
    return Object.entries(this.holidays).map(([ruleStr, obj]) => {
      return new HolidayRule({ ...obj, rule: ruleStr })
    })
  }

  /**
   * get rule for selected country, (state, region)
   * @param {String} rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31st Dec
   * @returns {HolidayRule|undefined}
   */
  getRule(rule) {
    if (this.holidays[rule]) {
      return new HolidayRule({ ...this.holidays[rule], rule })
    }
  }

  /**
   * Query for available Countries, States, Regions
   * @param {String} [country]
   * @param {String} [state]
   * @param {String} [lang] - ISO-639 language shortcode
   * @returns {Object} shortcode, name pairs of supported countries, states, regions
   */
  query(country, state, lang) {
    const o = Data.splitName(country, state)
    if (!o || !o.country) {
      return this.getCountries(lang)
    } else if (!o.state) {
      return this.getStates(o.country, lang)
    } else {
      return this.getRegions(o.country, o.state, lang)
    }
  }

  /**
   * get supported countries
   * @param {String} [lang] - ISO-639 language shortcode
   * @returns {Object} shortcode, name pairs of supported countries
   * ```js
   * { AD: 'Andorra',
   *   US: 'United States' }
   * ```
   */
  getCountries(lang) {
    return this.__data.getCountries(lang)
  }

  /**
   * get supported states for a given country
   * @param {String} country - shortcode of country
   * @param {String} [lang] - ISO-639 language shortcode
   * @returns {Object} shortcode, name pairs of supported states, regions
   * ```js
   * { al: 'Alabama', ...
   *   wy: 'Wyoming' }
   * ```
   */
  getStates(country, lang) {
    return this.__data.getStates(country, lang)
  }

  /**
   * get supported regions for a given country, state
   * @param {String} country - shortcode of country
   * @param {String} state - shortcode of state
   * @param {String} [lang] - ISO-639 language shortcode
   * @returns {Object} shortcode, name pairs of supported regions
   * ```js
   * { no: 'New Orleans' }
   * ```
   */
  getRegions(country, state, lang) {
    return this.__data.getRegions(country, state, lang)
  }

  /**
   * sets timezone
   * @param {String} timezone - see `moment-timezone`
   * if `timezone` is `undefined`, then all dates are considered local dates
   */
  setTimezone(timezone) {
    this.__timezone = timezone
  }

  /**
   * get timezones for country, state, region
   * @returns {Array} of {String}s containing the timezones
   */
  getTimezones() {
    if (this.__data) {
      return this.__data.getTimezones()
    }
  }

  /**
   * set language(s) for holiday names
   * @param {string|string[]} [language]
   * @returns {void}
   */
  setLanguages(language) {
    if (typeof language === 'string') {
      language = [language]
    }
    const tmp = {}
    this.__languages = []
      .concat(
        language,
        this.__conf ? this.__data.getLanguages(this.__conf) : [],
        'en'
      )
      .filter(function (l) {
        // filter out duplicates
        if (!l || tmp[l]) {
          return false
        }
        tmp[l] = 1
        return true
      })
  }

  /**
   * get languages for selected country, state, region
   * @returns {Array} containing ISO 639-1 language shortcodes
   */
  getLanguages() {
    return this.__languages
  }

  /**
   * get default day off as weekday
   * @returns {String} weekday of day off
   */
  getDayOff() {
    if (this.__conf) {
      return this.__data.getDayOff()
    }
  }

  /**
   * @private
   * @param {Number} year
   * @param {String} rule
   */
  /** @param {number} year @param {string} rule @returns {Holiday[]} */
  _dateByRule(year, rule) {
    const _rule = this.holidays[rule]
    if (!_rule || !_rule.fn || !_rule.fn.inYear) {
      return []
    }
    const dates = _rule.fn
      .inYear(year)
      .get(this.__timezone)
      .map((date) => {
        const odate = /** @type {Holiday} */ (
          /** @type {unknown} */ (
            _.merge(
              {},
              _.omit(date, ['substitute']),
              _.omit(_rule, ['fn', 'enable', 'disable', 'substitute', 'active'])
            )
          )
        )
        if (_rule.substitute && date.substitute) {
          odate.substitute = true
        }
        return odate
      })
    return dates
  }

  /**
   * translate holiday object `o` to a language
   * @private
   * @param {Holiday} o
   * @param {string[]} [langs] - languages for translation
   * @returns {Holiday} translated holiday object
   */
  _translate(o, langs) {
    if (o && typeof o.name === 'object') {
      langs = langs || this.getLanguages()
      for (const lang of langs) {
        const name = o.name[lang]
        if (name) {
          o.name = name
          break
        }
      }
      if (o.substitute) {
        for (const lang of langs) {
          const subst = this.__data.getSubstitueNames()
          const name = subst[lang]
          if (name) {
            o.name += ' (' + name + ')'
            break
          }
        }
      }
    }
    return o
  }
}

/**
 * @param {string|Location|HolidayOptions} [country]
 * @param {string|HolidayOptions} [state]
 * @param {string|HolidayOptions} [region]
 * @param {HolidayOptions} [opts]
 * @returns {[string|Location|undefined, string|undefined, string|undefined, HolidayOptions]}
 */
function getArgs(country, state, region, opts) {
  let options = opts
  if (region && typeof region === 'object') {
    options = region
    region = undefined
  } else if (state && typeof state === 'object') {
    options = state
    state = undefined
  } else if (
    country &&
    typeof country === 'object' &&
    !('country' in country)
  ) {
    options = country
    country = undefined
  }
  options = options || {}

  const normalizedCountry =
    typeof country === 'string'
      ? country
      : country &&
          typeof country === 'object' &&
          'country' in country &&
          typeof country.country === 'string'
        ? /** @type {Location} */ (country)
        : undefined
  const normalizedState = typeof state === 'string' ? state : undefined
  const normalizedRegion = typeof region === 'string' ? region : undefined
  return [normalizedCountry, normalizedState, normalizedRegion, options]
}
