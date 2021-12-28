# Global





* * *

## Class: Holidays


### Holidays.init(country, state, region, opts) 

initialize holidays for a country/state/region

**Parameters**

**country**: `String | Object`, if object use `{ country: {String}, state: {String}, region: {String} }`

**state**: `String`, specifies state

**region**: `String`, specifies region

**opts**: `Object`, options

 - **opts.languages**: `Array | String`, set language(s) with ISO 639-1 shortcodes

 - **opts.timezone**: `String`, set timezone

 - **opts.types**: `Array`, holiday types to consider; priority is in ascending order (low ... high)


### Holidays.setHoliday(rule, opts) 

set (custom) holiday

**Parameters**

**rule**: `String`, rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec

**opts**: `Object | String`, holiday options, if String then opts is used as name

 - **opts.name**: `Object`, translated holiday names e.g. `{ en: 'name', es: 'nombre', ... }`

 - **opts.type**: `String`, holiday type `public|bank|school|observance`

**Returns**: `Boolean`, `true` if holiday could be set

### Holidays.getHolidays(year, language) 

get all holidays for `year` with names using prefered `language`

**Parameters**

**year**: `String | Date`, if omitted current year is choosen

**language**: `String`, ISO 639-1 code for language

**Returns**: `Array.&lt;Holiday&gt;`, of found holidays in given year sorted by Date:
```
{String} date - ISO Date String of (start)-date in local format
{Date} start - start date of holiday
{Date} end - end date of holiday
{String} name - name of holiday using `language` (if available)
{String} type - type of holiday `public|bank|school|observance`
```

### Holidays.isHoliday(date) 

check whether `date` is a holiday or not

**Parameters**

**date**: `Date | String`, check whether `date` is a holiday or not

**Returns**: `Array.&lt;Holiday&gt; | false`, holiday:
```
{String} date - ISO Date String of (start)-date in local format
{Date} start - start date of holiday
{Date} end - end date of holiday
{String} name - name of holiday using `language` (if available)
{String} type - type of holiday `public|bank|school|observance`
```

### Holidays.setRule(holidayRule) 

set or update rule

**Parameters**

**holidayRule**: `HolidayRule | object`, set or update rule

**Returns**: `boolean`, `true` if holiday could be set returns `true`

### Holidays.unsetRule(rule) 

unset rule

**Parameters**

**rule**: `String`, rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec

**Returns**: `boolean`, `true` if holiday could be set returns `true`

### Holidays.getRules() 

get available rules for selected country, (state, region)

**Returns**: `Array.&lt;HolidayRule&gt;`

### Holidays.getRule(rule) 

get rule for selected country, (state, region)

**Parameters**

**rule**: `String`, rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec

**Returns**: `HolidayRule | undefined`

### Holidays.query(country, state, lang) 

Query for available Countries, States, Regions

**Parameters**

**country**: `String`, Query for available Countries, States, Regions

**state**: `String`, Query for available Countries, States, Regions

**lang**: `String`, ISO-639 language shortcode

**Returns**: `Object`, shortcode, name pairs of supported countries, states, regions

### Holidays.getCountries(lang) 

get supported countries

**Parameters**

**lang**: `String`, ISO-639 language shortcode

**Returns**: `Object`, shortcode, name pairs of supported countries
```js
{ AD: 'Andorra',
  US: 'United States' }
```

### Holidays.getStates(country, lang) 

get supported states for a given country

**Parameters**

**country**: `String`, shortcode of country

**lang**: `String`, ISO-639 language shortcode

**Returns**: `Object`, shortcode, name pairs of supported states, regions
```js
{ al: 'Alabama', ...
  wy: 'Wyoming' }
```

### Holidays.getRegions(country, state, lang) 

get supported regions for a given country, state

**Parameters**

**country**: `String`, shortcode of country

**state**: `String`, shortcode of state

**lang**: `String`, ISO-639 language shortcode

**Returns**: `Object`, shortcode, name pairs of supported regions
```js
{ no: 'New Orleans' }
```

### Holidays.setTimezone(timezone) 

sets timezone

**Parameters**

**timezone**: `String`, see `moment-timezone`
if `timezone` is `undefined` then all dates are considered local dates


### Holidays.getTimezones() 

get timezones for country, state, region

**Returns**: `Array`, of {String}s containing the timezones

### Holidays.setLanguages(language) 

set language(s) for holiday names

**Parameters**

**language**: `Array | String`, set language(s) for holiday names

**Returns**: `Array`, set languages

### Holidays.getLanguages() 

get languages for selected country, state, region

**Returns**: `Array`, containing ISO 639-1 language shortcodes

### Holidays.getDayOff() 

get default day off as weekday

**Returns**: `String`, weekday of day off



* * *










