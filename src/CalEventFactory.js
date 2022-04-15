/* eslint spaced-comment:0 */

import CalEvent from './CalEvent.js'
import Easter from './Easter.js'

// --- pre-processor instructions for prepin ---
// #ifndef nojulian
import Julian from './Julian.js'
// #endif
// #ifndef nohebrew
import Hebrew from './Hebrew.js'
// #endif
// #ifndef noislamic
import Hijri from './Hijri.js'
// #endif
// #ifndef nojalaali
import Jalaali from './Jalaali.js'
// #endif
// #ifndef noequinox
import Equinox from './Equinox.js'
// #endif
// #ifndef nochinese
import Chinese from './Chinese.js'
// #endif
// #ifndef nobengali
import BengaliRevised from './BengaliRevised.js'
// #endif

export default class CalEventFactory {
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
