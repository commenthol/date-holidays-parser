/**
 * Options shared by the calendar event implementations.
 * @private
 */
export interface EventOptions {
  fn?: string
  day?: number
  month?: number
  year?: number
  offset?: number
  substitute?: boolean
  type?: string
  season?: string
  timezone?: string
  cycle?: number
  leapMonth?: boolean
  leapDay?: boolean
  solarterm?: number
}
/**
 * @private
 */
export type RuleDate = import('caldate').default & {
  _filter?: boolean
  _lock?: boolean
  substitute?: boolean
}

/**
 * A token produced by the holiday-rule parser.
 * @private
 */
export interface RuleToken {
  fn?: string
  rule?: string
  modifier?: string
  type?: HolidayType
  direction?: string
  weekday?: string
  then?: string
  cardinality?: string
  season?: string
  timezone?: string
  year?: number
  month?: number
  day?: number
  offset?: number
  count?: number
  hour?: number
  minute?: number
  duration?: number
  every?: number
  since?: number
  cycle?: number
  solarterm?: number
  not?: boolean
  leapMonth?: boolean
  leapDay?: boolean
  if?: string[]
  omit?: string[]
  rules?: RuleToken[]
}

/**
 * @private
 */
export type CalendarData = Record<number, (number[] | null)[]> & {
  year: number
  months?: number
}

export interface Location {
  /** IANA country code. */
  country: string
  /** Short code of state (ISO 3166-2). */
  state?: string
  /** Short code of region. */
  region?: string
}

export type ActiveRange = { from?: Date | string; to?: Date | string }

/** Holiday types, in priority order from high to low. */
export type HolidayType =
  'public' | 'bank' | 'optional' | 'school' | 'observance'

/**
 * Options attached to a holiday rule. Additional data fields are preserved in
 * returned holiday objects.
 */
export interface HolidayOptions {
  name?: string | Record<string, string>
  type?: HolidayType
  substitute?: boolean
  enable?: string[]
  disable?: string[]
  active?: ActiveRange[]
  fn?: import('./DateFn.js').default
  rule?: string
  /** Languages using ISO 639-1 shortcodes. */
  languages?: string | string[]
  /** Timezone, e.g. America/New_York. */
  timezone?: string
  /** filter for holiday types */
  types?: HolidayType[]
  data?: object
}

export type HolidayRuleOptions = HolidayOptions & { rule: string }

/** A holiday occurrence returned by the public API. */
export interface Holiday {
  date: string
  start: Date
  end: Date
  name?: string | Record<string, string>
  type?: HolidayType
  rule?: string
  substitute?: boolean
}

export type HolidayMap = Record<string, HolidayOptions | false>
