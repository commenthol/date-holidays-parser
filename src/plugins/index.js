import { EasterCalendarPlugin } from './EasterCalendarPlugin.js'
import { EquinoxCalendarPlugin } from './EquinoxCalendarPlugin.js'
import { HebrewCalendarPlugin } from './HebrewCalendarPlugin.js'
import { HijriCalendarPlugin } from './HijriCalendarPlugin.js'
import { JulianCalendarPlugin } from './JulianCalendarPlugin.js'
import { JalaaliCalendarPlugin } from './JalaaliCalendarPlugin.js'
import { ChineseCalendarPlugin } from './ChineseCalendarPlugin.js'
import { BengaliRevisedCalendarPlugin } from './BengaliRevisedCalendarPlugin.js'
import { TibetanCalendarPlugin } from './TibetanCalendarPlugin.js'

export {
  EasterCalendarPlugin,
  EquinoxCalendarPlugin,
  HebrewCalendarPlugin,
  HijriCalendarPlugin,
  JulianCalendarPlugin,
  JalaaliCalendarPlugin,
  ChineseCalendarPlugin,
  BengaliRevisedCalendarPlugin,
  TibetanCalendarPlugin
}

/** @type {import('../types.js').CalendarPlugin<unknown>[]} */
export const plugins = [
  EasterCalendarPlugin,
  EquinoxCalendarPlugin,
  HebrewCalendarPlugin,
  HijriCalendarPlugin,
  JulianCalendarPlugin,
  JalaaliCalendarPlugin,
  ChineseCalendarPlugin,
  BengaliRevisedCalendarPlugin,
  TibetanCalendarPlugin
]

export default plugins
