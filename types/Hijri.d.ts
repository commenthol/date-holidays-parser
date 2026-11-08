import CalEventMap from './CalEventMap.js';
export default class Hijri extends CalEventMap {
    calendar: import("./types.js").CalendarData;
    constructor(opts: any);
    /**
     * @param {string} timezone
     * @returns {{date: string, start: Date, end: Date}[]}
     */
    get(timezone: string): {
        date: string;
        start: Date;
        end: Date;
    }[];
}
