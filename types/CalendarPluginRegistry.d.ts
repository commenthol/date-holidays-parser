/** @template TParsed @typedef {import('./types.js').CalendarPlugin<TParsed>} CalendarPlugin */
export type CalendarPlugin<TParsed> = import('./types.js').CalendarPlugin<TParsed>;
/**
 * Owns the plugins for one Holidays instance and resolves calendar syntax.
 */
export default class CalendarPluginRegistry {
    /** @type {CalendarPlugin<unknown>[]} */
    plugins: CalendarPlugin<unknown>[];
    /**
     * @param {CalendarPlugin<unknown>[]} [plugins]
     */
    constructor(plugins?: CalendarPlugin<unknown>[]);
    /**
     * @param {string} remainingRule
     * @returns {{ kind: 'no-match' } | { kind: 'invalid', message: string } | { kind: 'match', consumed: number, value: unknown, plugin: CalendarPlugin<unknown> }}
     */
    parse(remainingRule: string): {
        kind: 'no-match';
    } | {
        kind: 'invalid';
        message: string;
    } | {
        kind: 'match';
        consumed: number;
        value: unknown;
        plugin: CalendarPlugin<unknown>;
    };
}
