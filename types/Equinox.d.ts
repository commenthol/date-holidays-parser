import CalEvent from './CalEvent.js';
export type EventOptions = import('./types.js').EventOptions;
export default class Equinox extends CalEvent {
    _season: string;
    _timezone: string;
    /**
     * @param {EventOptions} [opts]
     */
    constructor(opts?: EventOptions);
    inYear(year: any): this;
}
