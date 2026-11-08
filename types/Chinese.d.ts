import { CalendarChinese } from 'date-chinese';
import CalEvent from './CalEvent.js';
export type EventOptions = import('./types.js').EventOptions;
/** @typedef {import('./types.js').EventOptions} EventOptions */
export default class Chinese extends CalEvent {
    cal: CalendarChinese;
    /**
     * @param {EventOptions} [opts]
     */
    constructor(opts?: EventOptions);
    inYear(year: any): this;
}
