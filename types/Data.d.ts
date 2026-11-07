/**
 * Handler for holiday data provided in the Json file
 * @class
 * @param {Object} [data]
 * @param {Object|String} [country]
 * @param {String} [state]
 * @param {String} [region]
 */
export default class Data {
    opts: any;
    data: any;
    constructor(data: any, country: any, state: any, region: any);
    /**
     * get all countries from the data
     * @param {String} lang - Iso-639 shortcode
     * @return {Object} shortcode-name value pairs. E.g. `{ AT: 'Österreich', ... }`
     */
    getCountries(lang: string): any;
    /**
     * get all states for a given country from the data
     * @param {String|Object} country
     * @param {String} [lang] - Iso-639 shortcode
     * @return {Object} shortcode-name value pairs. E.g. `{ b: 'Burgenland', ... }`
     */
    getStates(country: string | any, lang?: string): any;
    /**
     * get all regions for a given country/ state from the data
     * @param {String} country
     * @param {String} state
     * @param {String} [lang] - Iso-639 shortcode
     * @return {Object} shortcode-name value pairs.
     */
    getRegions(country: string, state: string, lang?: string): any;
    /**
     * @private
     */
    private _name;
    /**
     * get languages for selected country, state, region
     * @return {Array} containing ISO 639-1 language shortcodes
     */
    getLanguages(opts: any): any[];
    /**
     * get default day off as weekday
     * @return {String} weekday of day off
     */
    getDayOff(): string;
    /**
     * get timezones for country, state, region
     * @return {Array} of {String}s containing the timezones
     */
    getTimezones(): any[];
    /**
     * get list of raw holiday rules for country/ state/ region
     * @param {Object|String} [country]
     * @param {String} [state]
     * @param {String} [region]
     * @return {Object} holidayname <-> unparsed rule or date pairs
     */
    getRules(country?: any | string, state?: string, region?: string): any;
    /**
     * get name for substitute name
     * @return {Object} translations of substitute day names
     */
    getSubstitueNames(): any;
    /**
     * helper to assign objects based on properties
     * @private
     * @param {Object} out - object where obj gets assigned into
     * @param {Object} obj - input obj
     * @return {Object}
     */
    private _assign;
    /**
     * get a object from the data tree
     * @private
     * @param {String} key - key to look at
     * @return {Object} return object
     */
    private _getValue;
}
/**
 * Handler for holiday data provided in the Json file
 * @class
 * @param {Object} [data]
 * @param {Object|String} [country]
 * @param {String} [state]
 * @param {String} [region]
 */
export default namespace Data {
    var splitName: (country: string | any, state?: string, region?: string) => any;
    var majorLang: (lang: any) => any;
}
