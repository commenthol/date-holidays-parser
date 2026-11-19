import CoreHolidays from '../src/index.js'
import CoreDateFn from '../src/DateFn.js'
import CoreParser from '../src/Parser.js'
import CalendarPluginRegistry from '../src/CalendarPluginRegistry.js'
import plugins from '../src/plugins/index.js'

export { HolidayRule } from '../src/index.js'
export { plugins }

const pluginRegistry = new CalendarPluginRegistry(plugins)

function injectPlugins(args) {
  const optionIndex =
    args[3] && typeof args[3] === 'object'
      ? 3
      : args[2] && typeof args[2] === 'object'
        ? 2
        : args[1] && typeof args[1] === 'object' && !('country' in args[1])
          ? 1
          : 4
  const options = args[optionIndex] || {}
  args[optionIndex] = {
    ...options,
    plugins: options.plugins === undefined ? plugins : options.plugins
  }
  return args
}

export default class Holidays extends CoreHolidays {
  constructor(...args) {
    super(...injectPlugins(args))
  }
}

export class DateFn extends CoreDateFn {
  constructor(rule, holidays, registry, context) {
    super(rule, holidays, registry || pluginRegistry, context)
  }
}

export class Parser extends CoreParser {
  constructor(fns, registry) {
    super(fns, registry || pluginRegistry)
  }
}
