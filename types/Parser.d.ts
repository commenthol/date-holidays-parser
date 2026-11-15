import CalendarPluginRegistry from './CalendarPluginRegistry.js';
export type RuleToken = import('./types.js').RuleToken;
export type CalendarPluginRegistryType = import('./CalendarPluginRegistry.js').default;
export type ParserState = {
    str: string;
    rule: string;
};
export type RegexBuilder = ((name: string | RegExp, val: string | RegExp) => RegexBuilder) & (() => RegExp);
export default class Parser {
    calendarPluginRegistry: CalendarPluginRegistry;
    fns: string[];
    /** @type {RuleToken[]} */
    tokens: RuleToken[];
    setup: {
        str: string;
        rule: string;
    };
    error: number;
    /** @type {string|undefined} */
    errorMessage: string | undefined;
    /**
     * @param {string[]} [fns]
     * @param {CalendarPluginRegistryType} [calendarPluginRegistry]
     */
    constructor(fns?: string[], calendarPluginRegistry?: CalendarPluginRegistryType);
    /** @param {string} rule @returns {RuleToken[]} */
    parse(rule: string): RuleToken[];
    /**
     * reorder set of tokens for rule dateDir
     * dateDir: [dateDir2, dateDir1, fn] --> [fn, dateDir1, dateDir2]
     * dateIfThen: [fn, dateIfThen1, dateIfThen2] --> [fn, dateIfThen1, dateIfThen2]
     */
    _reorder(): void;
    /** @param {ParserState} o */
    _tokenize(o: ParserState): void;
    /** @param {ParserState} o @param {string} cap0 */
    _shorten(o: ParserState, cap0: string): void;
    _date(o: any): boolean;
    _dateMonth(o: any): boolean;
    _space(o: any): boolean;
    _ruleSameDay(o: any): boolean;
    _ruleModifier(o: any): boolean;
    _ruleTime(o: any): boolean;
    _ruleDuration(o: any): boolean;
    _ruleDateIfThen(o: any): boolean;
    _ruleWeekday(o: any): boolean;
    _ruleDateDir(o: any): boolean;
    _ruleYear(o: any): boolean;
    _ruleIfHoliday(o: any): boolean;
    _ruleBridge(o: any): boolean;
    _ruleActiveFrom(o: any): boolean;
    _ruleActiveTo(o: any): boolean;
}
