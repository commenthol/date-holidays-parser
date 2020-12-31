/**
 * @copyright 2016- (c) commenthol
 * @license ISC
 */

'use strict'

const CalDate = require('caldate')
const _ = require('./utils')
const { toYear, toDate } = require('./internal/utils')
const Data = require('./Data')
const DateFn = require('./DateFn')

// priority in ascending order (low ... high)
const TYPES = ['observance', 'optional', 'school', 'bank', 'public']

/**
 * @class
 * @param {Object} data - holiday data object - see data/holidays.json
 * @param {String|Object} country - if object use `{ country: {String}, state: {String}, region: {String} }`
 * @param {String} [state] - specifies state
 * @param {String} [region] - specifies region
 * @param {Object} [opts] - options
 * @param {Array|String} opts.languages - set language(s) with ISO 639-1 shortcodes
 * @param {String} opts.timezone - set timezone
 * @param {Array} opts.types - holiday types to consider
 * @example
 * ```js
 * new Holiday(data, 'US', 'la', 'no') // is the same as
 * new Holiday(data, 'us.la.no')       // is the same as
 * new Holiday(data, { country: 'us', state: 'la', region: 'no'})
 * ```
 */
function Holidays (data, country, state, region, opts) {
  if (!(this instanceof Holidays)) {
    return new Holidays(data, country, state, region, opts)
  }
  if (!data) {
    throw new TypeError('need holiday data')
  }
  this._data = data
  this.init(country, state, region, opts)
}
module.exports = Holidays

Holidays.prototype = {
  /**
   * initialize holidays for a country/state/region
   * @param {String|Object} country - if object use `{ country: {String}, state: {String}, region: {String} }`
   * @param {String} [state] - specifies state
   * @param {String} [region] - specifies region
   * @param {Object} [opts] - options
   * @param {Array|String} [opts.languages] - set language(s) with ISO 639-1 shortcodes
   * @param {String} [opts.timezone] - set timezone
   * @param {Array} [opts.types] - holiday types to consider
   */
  init (...args) {
    const [country, state, region, opts] = getArgs(...args)

    // reset settings
    this.__conf = null
    this.holidays = {}
    this.setLanguages()
    this._setTypes(opts.types)

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
  },

  /**
   * set (custom) holiday
   * @param {String} rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec
   * @param {Object|String} [opts] - holiday options, if String then opts is used as name
   * @param {Object} opts.name - translated holiday names e.g. `{ en: 'name', es: 'nombre', ... }`
   * @param {String} opts.type - holiday type `public|bank|school|observance`
   * @throws {TypeError}
   * @return {Boolean} if holiday could be set returns `true`
   */
  setHoliday (rule, opts) {
    // remove days
    if (opts === false) {
      if (this.holidays[rule]) {
        this.holidays[rule] = false
        return true
      }
      return false
    }

    // assign a name to rule
    if (!opts || typeof opts === 'string') {
      opts = opts || rule
      const lang = this.getLanguages()[0]
      opts = _.set({ type: 'public' }, ['name', lang], opts)
    }

    // convert active properties to Date
    if (opts.active) {
      if (!Array.isArray(opts.active)) {
        throw TypeError('.active is not of type Array: ' + rule)
      }
      opts.active = opts.active.map((a) => {
        const from = toDate(a.from)
        const to = toDate(a.to)
        if (!(from || to)) {
          throw TypeError('.active needs .from or .to property: ' + rule)
        }
        return { from, to }
      })
    }

    // check for supported type
    if (!this._hasType(opts.type)) {
      return false
    }

    this.holidays[rule] = opts

    const fn = new DateFn(rule, this.holidays)
    if (fn.ok) {
      this.holidays[rule].fn = fn
      return true
    } else {
      // throw Error('could not parse rule: ' + rule) // NEXT
      console.log('could not parse rule: ' + rule) // eslint-disable-line
    }
    return false
  },

  /**
   * get all holidays for `year` with names using prefered `language`
   * @param {String|Date} [year] - if omitted current year is choosen
   * @param {String} [language] - ISO 639-1 code for language
   * @return {Array} of found holidays in given year sorted by Date:
   * ```
   * {String} date - ISO Date String of (start)-date in local format
   * {Date} start - start date of holiday
   * {Date} end - end date of holiday
   * {String} name - name of holiday using `language` (if available)
   * {String} type - type of holiday `public|bank|school|observance`
   * ```
   */
  getHolidays (year, language) {
    year = toYear(year)

    const langs = this.getLanguages()
    if (language) {
      langs.unshift(language)
    }

    const startSorter = (a, b) => (+a.start) - (+b.start)
    const typeIndex = (a) => TYPES.indexOf(a.type)
    const typeSorter = (a, b) => typeIndex(b) - typeIndex(a)
    const ruleIndex = (a) => /substitutes|and if /.test(a.rule) ? 1 : 0
    const ruleLength = (a) => String(a.rule || '').length
    const ruleSorter = (a, b) => ruleIndex(a) - ruleIndex(b) || ruleLength(a) - ruleLength(b)

    const filterMap = {}

    const arr = Object.keys(this.holidays)
      .reduce((arr, rule) => {
        if (this.holidays[rule].fn) {
          this._dateByRule(year, rule).forEach((o) => {
            arr.push({ ...this._translate(o, langs), rule })
          })
        }
        return arr
      }, [])
      // sort by date and type to filter by duplicate
      .sort((a, b) => startSorter(a, b) || typeSorter(a, b) || ruleSorter(a, b))
      .filter(item => {
        const hash = item.name + (+item.start)
        if (!filterMap[hash]) {
          filterMap[hash] = true
          return true
        }
        return false
      })

    return arr
  },

  /**
   * check whether `date` is a holiday or not
   * @param {Date} [date]
   * @return {Object} holiday:
   * ```
   * {String} date - ISO Date String of (start)-date in local format
   * {Date} start - start date of holiday
   * {Date} end - end date of holiday
   * {String} name - name of holiday using `language` (if available)
   * {String} type - type of holiday `public|bank|school|observance`
   * ```
   */
  isHoliday (date) {
    date = date || new Date()
    const d = new CalDate()
    d.fromTimezone(date, this.__timezone)
    const year = d.year
    const rules = Object.keys(this.holidays)
    for (const i in rules) {
      const hd = [].concat(this._dateByRule(year, rules[i]))
      for (const j in hd) {
        if (hd[j] && date >= hd[j].start && date < hd[j].end) {
          return this._translate(hd[j])
        }
      }
    }
    return false
  },

  /**
   * Query for available Countries, States, Regions
   * @param {String} [country]
   * @param {String} [state]
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported countries, states, regions
   */
  query (country, state, lang) {
    const o = Data.splitName(country, state)
    if (!o || !o.country) {
      return this.getCountries(lang)
    } else if (!o.state) {
      return this.getStates(o.country, lang)
    } else {
      return this.getRegions(o.country, o.state, lang)
    }
  },

  /**
   * get supported countries
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported countries
   * ```js
   * { AD: 'Andorra',
   *   US: 'United States' }
   * ```
   */
  getCountries (lang) {
    return this.__data.getCountries(lang)
  },

  /**
   * get supported states for a given country
   * @param {String} country - shortcode of country
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported states, regions
   * ```js
   * { al: 'Alabama', ...
   *   wy: 'Wyoming' }
   * ```
   */
  getStates (country, lang) {
    return this.__data.getStates(country, lang)
  },

  /**
   * get supported regions for a given country, state
   * @param {String} country - shortcode of country
   * @param {String} state - shortcode of state
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported regions
   * ```js
   * { no: 'New Orleans' }
   * ```
   */
  getRegions (country, state, lang) {
    return this.__data.getRegions(country, state, lang)
  },

  /**
   * get timezones for country, state, region
   * @return {Array} of {String}s containing the timezones
   */
  getTimezones () {
    if (this.__data) {
      return this.__data.getTimezones()
    }
  },

  /**
   * sets timezone
   * @param {String} timezone - see `moment-timezone`
   * if `timezone` is `undefined` then all dates are considered local dates
   */
  setTimezone (timezone) {
    this.__timezone = timezone
  },

  /**
   * get languages for selected country, state, region
   * @return {Array} containing ISO 639-1 language shortcodes
   */
  getLanguages () {
    return this.__languages
  },

  /**
   * set language(s) for holiday names
   * @param {Array|String} language
   * @return {Array} set languages
   */
  setLanguages (language) {
    if (typeof language === 'string') {
      language = [language]
    }
    const tmp = {}
    this.__languages = [].concat(
      language,
      (this.__conf ? this.__data.getLanguages(this.__conf) : []),
      'en'
    ).filter(function (l) { // filter out duplicates
      if (!l || tmp[l]) {
        return false
      }
      tmp[l] = 1
      return true
    })
  },

  /**
   * get default day off as weekday
   * @return {String} weekday of day off
   */
  getDayOff () {
    if (this.__conf) {
      return this.__data.getDayOff()
    }
  },

  /**
   * @private
   * @param {Number} year
   * @param {String} rule
   */
  _dateByRule (year, rule) {
    const _rule = this.holidays[rule]
    const dates = _rule.fn.inYear(year)
      .get(this.__timezone)
      .map((date) => {
        const odate = _.merge({},
          _.omit(date, ['substitute']),
          _.omit(_rule, ['fn', 'enable', 'disable', 'substitute', 'active'])
        )
        if (_rule.substitute && date.substitute) {
          odate.substitute = true
        }
        return odate
      })
    return dates
  },

  /**
   * translate holiday object `o` to a language
   * @private
   * @param {Object} o
   * @param {Array} langs - languages for translation
   * @return {Object} translated holiday object
   */
  _translate (o, langs) {
    if (o && typeof o.name === 'object') {
      langs = langs || this.getLanguages()
      for (const i in langs) {
        const name = o.name[langs[i]]
        if (name) {
          o.name = name
          break
        }
      }
      if (o.substitute) {
        for (const i in langs) {
          const subst = this.__data.getSubstitueNames()
          const name = subst[langs[i]]
          if (name) {
            o.name += ' (' + name + ')'
            break
          }
        }
      }
    }
    return o
  },

  /**
   * set holiday types
   * @private
   * @param {Array} [t] - holiday types
   * @return {Object} new array of types
   */
  _setTypes (t) {
    t = t || TYPES
    this.__types = TYPES.reduce((types, type) => {
      if (t.indexOf(type) !== -1) {
        types[type] = 1
      }
      return types
    }, {})
  },

  /**
   * check for supported holiday type
   * @private
   * @param {String} type
   * @return {Boolean}
   */
  _hasType (type) {
    return !!this.__types[type]
  }
}

function getArgs (country, state, region, opts) {
  if (typeof region === 'object') {
    opts = region
    region = null
  } else if (typeof state === 'object') {
    opts = state
    state = null
  } else if (typeof country === 'object' && !country.country) {
    opts = country
  }
  opts = opts || {}
  return [country, state, region, opts]
}
