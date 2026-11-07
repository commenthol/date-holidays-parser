import CalEvent from './CalEvent.js';
export type EventOptions = import('./types.js').EventOptions;
/** @typedef {import('./types.js').EventOptions} EventOptions */
export default class BengaliRevised extends CalEvent {
    /**
     * @param {EventOptions} [opts]
     */
    constructor(opts?: EventOptions);
    inYear(year: any): this;
}
