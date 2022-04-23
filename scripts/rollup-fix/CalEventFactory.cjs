'use strict'

const CalEvent = require('./CalEvent.cjs')
const Easter = require('./Easter.cjs')

// --- pre-processor instructions for prepin ---
// #ifndef nojulian
const Julian = require('./Julian.cjs')
// #endif
// #ifndef nojalaali
const Jalaali = require('./Jalaali.cjs')
// #endif
// #ifndef nohebrew
const Hebrew = require('./Hebrew.cjs')
// #endif
// #ifndef noislamic
const Hijri = require('./Hijri.cjs')
// #endif
// #ifndef noequinox
const Equinox = require('./Equinox.cjs')
// #endif
// #ifndef nochinese
const Chinese = require('./Chinese.cjs')
// #endif
// #ifndef nobengali
const BengaliRevised = require('./BengaliRevised.cjs')
// #endif

/* eslint spaced-comment:0 */

class CalEventFactory {
  constructor (opts) {
    switch (opts.fn) {
      case 'easter':
        return new Easter(opts)
      // #ifndef nojulian
      case 'julian':
        return new Julian(opts)
      // #endif
      // #ifndef nohebrew
      case 'hebrew':
        return new Hebrew(opts)
      // #endif
      // #ifndef noislamic
      case 'islamic':
        return new Hijri(opts)
      // #endif
      // #ifndef nojalaali
      case 'jalaali':
        return new Jalaali(opts)
      // #endif
      // #ifndef noequinox
      case 'equinox':
        return new Equinox(opts)
      // #endif
      // #ifndef nochinese
      case 'chinese':
      case 'korean':
      case 'vietnamese':
        return new Chinese(opts)
      // #endif
      // #ifndef nobengali
      case 'bengali-revised':
        return new BengaliRevised(opts)
      // #endif
      default:
        return new CalEvent(opts)
    }
  }
}

module.exports = CalEventFactory
