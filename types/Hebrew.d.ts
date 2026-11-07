import CalEventMap from './CalEventMap.js';
export default class Hebrew extends CalEventMap {
    calendar: import("./types.js").CalendarData;
    constructor(opts: any);
    get(timezone: any): {
        date: string;
        start: any;
        end: any;
    }[];
}
