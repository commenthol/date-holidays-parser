# date-holidays-parser

> parser for world-wide holidays

[![NPM version](https://badge.fury.io/js/date-holidays-parser.svg)](https://www.npmjs.com/package/date-holidays-parser/)
[![Build Status](https://github.com/commenthol/date-holidays-parser/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/commenthol/date-holidays-parser/actions/workflows/ci.yml?query=branch%3Amaster)

This module provides a parser for [date-holidays][] which does calculation of
holidays dates for various countries, states and regions by type while
considering the applicable timezone.

The features are:

- calculation of public, bank and observance holidays for different
  countries, state, region, following ISO 3166-2
- consideration of timezones for holiday checks
- consideration of start and end time dependent on timezone
- substitute days
- multi-language support for all holiday names
- setting of custom holidays
- uses own grammar for calculation of days
- support for islamic calendar from 1970 to 2080 (*islamic dates might
  not be correct as they are subject to the sighting of the moon)
- support for hebrew calendar from 1970 to 2100
- support for chinese calendar

Happy holidays!

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Usage](#usage)
* [Holiday object](#holiday-object)
  * [Dates](#dates)
  * [Name](#name)
  * [Types of holidays](#types-of-holidays)
* [API](#api)
* [Browser](#browser)
* [Data](#data)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Usage

```js
const data = require('date-holidays/data/holidays.json')
const Holidays = require('date-holidays-parser')
const hd = new Holidays(data)

// get supported countries
hd.getCountries()
/*>
{ AD: 'Andorra',
  ...
  US: 'United States' }
*/

// get supported states e.g. for US
hd.getStates('US')
/*>
{ al: 'Alabama',
  ...
  wy: 'Wyoming' }
*/

// get supported regions e.g. for US, Lousiana
hd.getRegions('US', 'la')
/*>
{ no: 'New Orleans' }
*/

// initialize holidays for US, Lousiana, New Orleans
hd.init('US', 'la', 'no')
// or using a new instance
hd = new Holidays('US', 'la', 'no')

// get all holidays for the year 2016
hd.getHolidays(2016)
/*>
[ { date: '2016-01-01 00:00:00',
    start: Fri Jan 01 2016 00:00:00 GMT-0600 (CST),
    end: Sat Jan 02 2016 00:00:00 GMT-0600 (CST),
    name: 'New Year\'s Day',
    type: 'public' },
  ...
  { date: '2016-11-24 00:00:00',
    start: Thu Nov 24 2016 00:00:00 GMT-0600 (CST),
    end: Fri Nov 25 2016 00:00:00 GMT-0600 (CST),
    name: 'Thanksgiving Day',
    type: 'public' },
  ...
  { date: '2016-12-26 00:00:00',
    start: Mon Dec 26 2016 00:00:00 GMT-0600 (CST),
    end: Tue Dec 27 2016 00:00:00 GMT-0600 (CST),
    substitute: true,
    name: 'Christmas Day (substitute day)',
    type: 'public' } ]
*/

// check if date is a holiday while respecting timezones
hd.isHoliday(new Date('2016-02-09 00:00:00 GMT+0000'))
//> false
hd.isHoliday(new Date('2016-02-09 10:00:00 GMT-0600'))
/*>
{ date: '2016-02-09 00:00:00',
  start: Tue Feb 09 2016 00:00:00 GMT-0600 (CST),
  end: Wed Feb 10 2016 00:00:00 GMT-0600 (CST),
  name: 'Mardi Gras',
  type: 'public' }
*/
```

## Holiday object

`getHolidays()` as well as a matching `isHoliday()` call return either
a list or a single holiday object which consists of:

* {String} date - ISO Date String of (start)-date in local format
* {Date} start - start date of holiday
* {Date} end - end date of holiday
* {String} name - name of holiday using `language` (if available)
* {String} type - type of holiday `public|bank|school|optional|observance`
* {Boolean} substitute - (optional) if true holiday substitutes another holiday`
* {String} note - (optional) note`

### Dates

The `date` String represents the start date of the holiday in ISO
format without timezone. This string it intended for information only.

`start` and `end` are the start/end date of the holiday within the
selected timezone of the country, state, region.

### Name

The `name` names the holiday in the local language of the selected
country, state, region. The applied language(s) can be requested using
`getLanguages()`.

The language can be changed using the `setLanguages()` method. In case
that not translation is available a fall-back to the next given
language will be made. E.g. local language is "fr",
`setLanguages('nl')` was called. For all holidays where no dutch
translation is available the French version will be used instead.

All holiday names should support an English translation.

### Types of holidays

Currently the following type with their meaning are supported

type        | meaning                                   
----------- | ------------------------------------------
public      | public holiday                            
bank        | bank holiday, banks and offices are closed
school      | school holiday, schools are closed        
optional    | majority of people take a day off         
observance  | optional festivity, no paid day off       

Additionally a `note` field is sometimes available for further
clarification.

## API

See [Holidays API][] for further information.

## Browser

This project also runs in all modern browsers. See `./examples/browser`

Browser | Version | Notes
---     | ---     | ---
Chrome  | >=45    |
Firefox | >=45    |
Safari  | >=10    |
Edge    | >=13    |
IE      | >=10    | needs polyfill `core-js/es6`

Please do not forget to set the correct charset!

```html
<html>
<head>
  <!-- set page-wide -->
  <meta charset="UTF-8">
  ...
</head>
<body>
  ...
  <!-- or per script -->
  <script src="your-bundle.js" charset="UTF-8"></script>
```

Testing was done with `zuul`. For local browser tests run `npm run zuul
-- --local 3000` and open <http://localhost:3000/__zuul>.

requires manual install of

```
npm i zuul@3 browserify@10
```

## Data

All data for the holidays of the different countries is contained in
[`./data/holidays.json`](./data/holidays.json). For changing holiday
data edit the appropriate country in `./data/countries`. Any details on
structure and available grammar for holiday attribution is described in
[holidays.yaml specification][].

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the ISC license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and license.

## License

Copyright (c) 2015-present commenthol ([ISC License][])

See [LICENSE][] for more information.

## References

<!-- !ref -->

* [date-holidays][date-holidays]
* [date-holidays-ical][date-holidays-ical]
* [Holidays API][Holidays API]
* [holidays.yaml specification][holidays.yaml specification]
* [ISC License][ISC License]
* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
[holidays.yaml specification]: https://github.com/commenthol/date-holidays/docs/specification.md
[Holidays API]: https://github.com/commenthol/date-holidays-parser/blob/master/docs/Holidays.md
[date-holidays]: https://github.com/commenthol/date-holidays
[date-holidays-ical]: https://github.com/commenthol/date-holidays-ical
[ISC License]: http://opensource.org/licenses/ISC
