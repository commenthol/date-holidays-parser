import CalEvent from './CalEvent.js';
/**
 * Mapper class for mapped calenders like hijri and hebrew
 * `this.calender` needs to be set in child classes
 */
export default class CalEventMap extends CalEvent {
    calendar: {};
    constructor(opts: any);
    inYear(year: any): this;
}
