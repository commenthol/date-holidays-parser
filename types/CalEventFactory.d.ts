import CalEvent from './CalEvent.js';
export type EventOptions = import('./types.js').EventOptions;
/** @typedef {import('./types.js').EventOptions} EventOptions */
export declare class CalEventFactory extends CalEvent {
    /** @param {EventOptions} opts */
    constructor(opts: EventOptions);
}
