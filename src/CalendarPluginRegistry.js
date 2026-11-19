/** @template TParsed @typedef {import('./types.js').CalendarPlugin<TParsed>} CalendarPlugin */

/**
 * Owns the plugins for one Holidays instance and resolves calendar syntax.
 */
export default class CalendarPluginRegistry {
  /**
   * @param {CalendarPlugin<unknown>[]} [plugins]
   */
  constructor(plugins = []) {
    if (!Array.isArray(plugins)) {
      throw new TypeError('calendar plugins must be an array')
    }

    /** @type {CalendarPlugin<unknown>[]} */
    this.plugins = plugins.slice()
    const names = new Set()
    for (const plugin of this.plugins) {
      if (
        !plugin ||
        !Array.isArray(plugin.fnNames) ||
        !plugin.fnNames.length ||
        typeof plugin.parse !== 'function' ||
        typeof plugin.calculate !== 'function'
      ) {
        throw new TypeError('invalid calendar plugin')
      }
      for (const name of plugin.fnNames) {
        if (typeof name !== 'string' || !name) {
          throw new TypeError(
            'calendar plugin fn names must be non-empty strings'
          )
        }
        if (names.has(name)) {
          throw new TypeError('duplicate calendar plugin fn name: ' + name)
        }
        names.add(name)
      }
    }
  }

  /**
   * @param {string} remainingRule
   * @returns {{ kind: 'no-match' } | { kind: 'invalid', message: string } | { kind: 'match', consumed: number, value: unknown, plugin: CalendarPlugin<unknown> }}
   */
  parse(remainingRule) {
    /** @type {{ plugin: CalendarPlugin<unknown>, result: import('./types.js').CalendarParseResult<unknown> }[]} */
    const matches = []
    for (const plugin of this.plugins) {
      const result = plugin.parse(remainingRule)
      if (!result || !['no-match', 'match', 'invalid'].includes(result.kind)) {
        throw new TypeError('invalid calendar plugin parse result')
      }
      if (result.kind === 'invalid' && typeof result.message !== 'string') {
        throw new TypeError('invalid calendar plugin parse result')
      }
      if (result.kind !== 'no-match') {
        matches.push({ plugin, result })
      }
    }

    if (!matches.length) return { kind: 'no-match' }
    if (matches.length > 1) {
      return { kind: 'invalid', message: 'ambiguous calendar plugin match' }
    }

    const { plugin, result } = matches[0]
    if (result.kind === 'invalid') return result
    if (result.kind !== 'match') {
      return {
        kind: 'invalid',
        message: 'invalid calendar plugin parse result'
      }
    }
    if (
      !Number.isInteger(result.consumed) ||
      result.consumed <= 0 ||
      result.consumed > remainingRule.length
    ) {
      return {
        kind: 'invalid',
        message: 'invalid calendar plugin match length'
      }
    }
    return { ...result, plugin }
  }
}
