import type { TimezoneAdapter } from 'caldate';
/** A Gregorian civil date with an optional local clock offset and duration. */
export interface CalendarDate {
    year: number;
    /** 1-based Gregorian month. */
    month: number;
    day: number;
    /** Integer local offset from midnight in minutes; -360 starts at 18:00 the previous day and formats as -0600. */
    offsetMinutes?: number;
    /** Optional duration in hours from the local start; without it, offset dates end at the same local time the next day. */
    duration?: number;
}
/** Context available to calendar plugin calculations. */
export interface CalendarContext {
    timezone?: string;
    timezoneAdapter?: TimezoneAdapter;
    /** Representative coordinates of the selected location, in decimal degrees. */
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
export type CalendarParseResult<TParsed> = {
    kind: 'no-match';
} | {
    kind: 'match';
    consumed: number;
    value: TParsed;
} | {
    kind: 'invalid';
    message: string;
};
/** Application-supplied calendar parser and calculator. */
export interface CalendarPlugin<TParsed = unknown> {
    fnNames: readonly string[];
    parse(remainingRule: string): CalendarParseResult<TParsed>;
    calculate(parsed: TParsed, gregorianYear: number, context: CalendarContext): readonly CalendarDate[];
}
/**
 * Options shared by the calendar event implementations.
 * @private
 */
export interface EventOptions {
    fn?: string;
    day?: number;
    month?: number;
    year?: number;
    offset?: number;
    substitute?: boolean;
    type?: string;
}
/**
 * @private
 */
export type RuleDate = import('caldate').default & {
    _calendarOffsetMinutes?: number;
    _calendarDuration?: number;
    _filter?: boolean;
    _lock?: boolean;
    substitute?: boolean;
};
/**
 * A token produced by the holiday-rule parser.
 * @private
 */
export interface RuleToken {
    fn?: string;
    /** Internal plugin parse state, not part of the public token shape. */
    calendar?: {
        plugin: CalendarPlugin<unknown>;
        value: unknown;
    };
    rule?: string;
    modifier?: string;
    type?: HolidayType;
    direction?: string;
    weekday?: string;
    then?: string;
    cardinality?: string;
    year?: number;
    month?: number;
    day?: number;
    offset?: number;
    count?: number;
    hour?: number;
    minute?: number;
    duration?: number;
    every?: number;
    since?: number;
    not?: boolean;
    if?: string[];
    omit?: string[];
    rules?: RuleToken[];
}
/**
 * @private
 */
export type CalendarData = Record<number, (number[] | null)[]> & {
    year: number;
    months?: number;
};
export interface Location {
    /** IANA country code. */
    country: string;
    /** Short code of state (ISO 3166-2). */
    state?: string;
    /** Short code of region. */
    region?: string;
}
export type ActiveRange = {
    from?: Date | string;
    to?: Date | string;
};
/** Holiday types, in priority order from high to low. */
export type HolidayType = 'public' | 'bank' | 'optional' | 'school' | 'observance';
/**
 * Options attached to a holiday rule. Additional data fields are preserved in
 * returned holiday objects.
 */
export interface HolidayOptions {
    name?: string | Record<string, string>;
    type?: HolidayType;
    substitute?: boolean;
    enable?: string[];
    disable?: string[];
    active?: ActiveRange[];
    fn?: import('./DateFn.js').default;
    rule?: string;
    /** Languages using ISO 639-1 shortcodes. */
    languages?: string | string[];
    /** Timezone, e.g. America/New_York. */
    timezone?: string;
    /** filter for holiday types */
    types?: HolidayType[];
    data?: object;
}
export interface HolidaysOptions extends HolidayOptions {
    /** Timezone conversion implementation for this Holidays instance. */
    timezoneAdapter?: TimezoneAdapter;
    /** Calendar plugins enabled for this instance; omitted means no calendar plugins. */
    plugins?: CalendarPlugin<unknown>[];
}
export type HolidayRuleOptions = HolidayOptions & {
    rule: string;
};
/** A holiday occurrence returned by the public API. */
export interface Holiday {
    /** ISO Date String of (start)-date in local format */
    date: string;
    /** start date of holiday */
    start: Date;
    /**  end date of holiday */
    end: Date;
    /** name of holiday using `language` (if available) */
    name?: string | Record<string, string>;
    /** type of holiday `public|bank|school|observance */
    type?: HolidayType;
    /** substitutes holiday if true */
    substitute?: boolean;
    /** the matching rule */
    rule?: string;
}
export type HolidayMap = Record<string, HolidayOptions | false>;
