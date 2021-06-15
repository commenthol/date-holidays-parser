# Changelog

## [3.2.1](https://github.com/commenthol/date-holidays-parser/compare/3.2.0...3.2.1) (2021-06-15)

- fix: clone dates before timezone shift [cf53ed2](https://github.com/commenthol/date-holidays-parser/commit/cf53ed2469fcc0462edb111a50fa6791735855e8)
- fix: remove use strict [a3fb423](https://github.com/commenthol/date-holidays-parser/commit/a3fb4230252453a9f75efbfb66ebcc2d582c7006)

## [3.2.0](https://github.com/commenthol/date-holidays-parser/compare/3.1.0...3.2.0) (2021-05-22)

- fix: esm astronomia imports [e2bde32](https://github.com/commenthol/date-holidays-parser/commit/e2bde327b626a02b836268fed8c73a66aa10b208)
- fix: ts export namespace [f4f7be2](https://github.com/commenthol/date-holidays-parser/commit/f4f7be2c8999d458577bce7babcdd404163d2ee8)  
  to use ts types in your typescript projects use

  ```ts
  import Holidays, { HolidaysTypes } from 'date-holidays-parser'
  ```

- fix: package.json module for angular [8b02806](https://github.com/commenthol/date-holidays-parser/commit/8b0280657cc98bbfb6266e0f9c089d35b4f199a4)

## [3.1.0](https://github.com/commenthol/date-holidays-parser/compare/3.0.1...3.1.0) (2021-05-03)

- chore: changelog [69bc4c2](https://github.com/commenthol/date-holidays-parser/commit/69bc4c22f51c5217f527afd6b6707aee0000088a)
- fix: remove optional chaining operator to work with node@12 [ecb84ce](https://github.com/commenthol/date-holidays-parser/commit/ecb84ce2625dc800536621e2d4f08e9cb4fd3bd6)
- feat: DateFn cache results [a74c02d](https://github.com/commenthol/date-holidays-parser/commit/a74c02d989b6978713185e9cd741b0adc0a2b8be)
- test: custom attributes [2e9b2a7](https://github.com/commenthol/date-holidays-parser/commit/2e9b2a7872c164f6295ce1576f41710cf054d532)
- fix: typings [114416b](https://github.com/commenthol/date-holidays-parser/commit/114416b6b4fec801dfee679ec70d9de6814454a6)
- feat: methods to get, set, unset holiday rules [7775351](https://github.com/commenthol/date-holidays-parser/commit/7775351f0e057537daff44535c7060b611b40397)
- refactor: calevent.filterActive [b49d26b](https://github.com/commenthol/date-holidays-parser/commit/b49d26bff4fc9b3a2fd9bc266aa018a688b3e260)
- fix: isHoliday(date) may be a string type [7db3d6b](https://github.com/commenthol/date-holidays-parser/commit/7db3d6b670c81192ae5f1599bf94faac31366dec)

## [3.0.2](https://github.com/commenthol/date-holidays-parser/compare/3.0.0...3.0.1) (2021-05-02)

- fix: rollup for prepin [e9c01d2](https://github.com/commenthol/date-holidays-parser/commit/e9c01d2adbf562813e8cd82beb9cb74eddfe683f)

## [3.0.0](https://github.com/commenthol/date-holidays-parser/compare/2.1.0...3.0.0) (2021-03-27)

- chore: reduce package size [b4ffaac](https://github.com/commenthol/date-holidays-parser/commit/b4ffaac0b718a76b195a07a86bac12fbfdf10df3)
- fix: for in loops on arrays [228c3d2](https://github.com/commenthol/date-holidays-parser/commit/228c3d2e997ed2e11d842adbe4e1d1b09fa55100)
- fix: import astronomia [a323252](https://github.com/commenthol/date-holidays-parser/commit/a3232524e39e43bdabaf86c0b2d2e9fa321336e2)
- break: esm module [615f225](https://github.com/commenthol/date-holidays-parser/commit/615f225037940d092cab1d07c845fff720618cb0)

## [2.1.0](https://github.com/commenthol/date-holidays-parser/compare/2.0.1...2.1.0) (2021-02-13)

- fix: parsing rule for solstice, equinox [c569bb1](https://github.com/commenthol/date-holidays-parser/commit/c569bb1d270dce0721484e7c4a0100307adbcd7b)
- feat: new rule since and prior to [2056356](https://github.com/commenthol/date-holidays-parser/commit/2056356427e749745a64a51a76cd30e04bae7080)

## [2.0.1](https://github.com/commenthol/date-holidays-parser/compare/2.0.0...2.0.1) (2021-02-07)

- fix: Month spelling for equinox, solstice [c8c0c58](https://github.com/commenthol/date-holidays-parser/commit/c8c0c5895e644d3d2e15d34200e66eb4a9e81fcb)
- docs: fix weekday spelling [9acf59a](https://github.com/commenthol/date-holidays-parser/commit/9acf59ae53b58454ad170dc540165239e54fb11f)
- fix: Allow correct spelled weekdays [28a1635](https://github.com/commenthol/date-holidays-parser/commit/28a16353cf97b901c02f45498336df0f03a6b369)

## [1.6.0](https://github.com/commenthol/date-holidays-parser/compare/1.5.0...1.6.0) (2021-01-04)

- fix: Fix collision in PostRule with Array prototype overrides [7f69163](https://github.com/commenthol/date-holidays-parser/commit/7f6916332a427bed1f4b4c78da703158453d8e11)
- feat: replace lodash function to reduce bundle size [516966a](https://github.com/commenthol/date-holidays-parser/commit/516966ad052cb7ab1fbb2b32a9392aa1974d02a3)

## [1.5.0](https://github.com/commenthol/date-holidays-parser/compare/1.4.3...1.5.0)

- fix: sort by rule length [45f4bcf](https://github.com/commenthol/date-holidays-parser/commit/45f4bcfb837ae72f2ab6867d4ca4aa22821a070b)
- fix: add sort by rule [280729a](https://github.com/commenthol/date-holidays-parser/commit/280729aa98fd695f82c2c3be3a3d6bc807b9cce8)
- chore: update fixtures [732ff84](https://github.com/commenthol/date-holidays-parser/commit/732ff847933f686c68fb012a08a391718510c670)
- chore: remove node@8 from travis [9c38d33](https://github.com/commenthol/date-holidays-parser/commit/9c38d33689070abd44eea3dd20073e6f8d7779d9)
- fix: sort order by date and type [db70108](https://github.com/commenthol/date-holidays-parser/commit/db70108ac32983f14b7d028882d20a254b5e6c22)
- docs: clarify substitute, if, then rule [463c3e6](https://github.com/commenthol/date-holidays-parser/commit/463c3e6e68e5cbe627aa1e81db99b5e2d60e5762)
- test: fix tests [c74a7ce](https://github.com/commenthol/date-holidays-parser/commit/c74a7ce8238d481f62ab412a5aba66537436ac4f)
- feat: return rule in getHolidays [b146eb3](https://github.com/commenthol/date-holidays-parser/commit/b146eb35da5ad4e262937889be610324d1ad2a82)

## [1.4.3](https://github.com/commenthol/date-holidays-parser/compare/1.4.2...1.4.3)

- feat: return rule in getHolidays [31b6b48](https://github.com/commenthol/date-holidays-parser/commit/31b6b4828470ad2590b27f10db7d1596530b5614)

## [1.4.2](https://github.com/commenthol/date-holidays-parser/compare/1.4.1...1.4.2)

- fix: shift timezone for isHolidays [c337ec1](https://github.com/commenthol/date-holidays-parser/commit/c337ec18e702aeaf3d062ea6d657549a836d7257)

## [1.4.1](https://github.com/commenthol/date-holidays-parser/compare/1.4.0...1.4.1)

- Update specification.md [67d0f01](https://github.com/commenthol/date-holidays-parser/commit/67d0f01b1207aa20e0d1038eb6a1c00bc050e9f3)
- Update Holidays.md [8562936](https://github.com/commenthol/date-holidays-parser/commit/85629360b6f47794e6fff2c019b9896b5d51d16b)

## [1.4.0](https://github.com/commenthol/date-holidays-parser/compare/1.3.2...1.4.0)

- docu: add specification [e273030](https://github.com/commenthol/date-holidays-parser/commit/e273030f2cb6559c440108f1d256b8ec322e6530)
- chore: update to babel7 [332c410](https://github.com/commenthol/date-holidays-parser/commit/332c4105dd999273aa386183e9628a134cf820e7)
- feat: add bengali-revised date [dc74d55](https://github.com/commenthol/date-holidays-parser/commit/dc74d55abbded892a0dc6e2daaec87cab1cf0b3f)

## [1.3.2](https://github.com/commenthol/date-holidays-parser/compare/1.3.1...1.3.2)

- fix: set country, state as object [bcb427e](https://github.com/commenthol/date-holidays-parser/commit/bcb427eb260da0ca78b71943e7b233e329041d32)
- refactor: make isActive static [58c98d9](https://github.com/commenthol/date-holidays-parser/commit/58c98d93fa9f4b0c7b04dfcd1bb2921bb562f8ec)

## [1.3.1](https://github.com/commenthol/date-holidays-parser/compare/1.3.0...1.3.1)

- deprecate node 4 [318b175](https://github.com/commenthol/date-holidays-parser/commit/318b175ff890a4d8bff2bfc7a39da8686d74b79e)
- fix: country name translation issue [bf27ab7](https://github.com/commenthol/date-holidays-parser/commit/bf27ab7f0adab638adee914ffa07e4ccc3d209f6)
- fix: spray debugger statement [7265b68](https://github.com/commenthol/date-holidays-parser/commit/7265b688b60137053d1ecaca0305b0e1e0c89b7b)
- fix: translation issue [14f0c36](https://github.com/commenthol/date-holidays-parser/commit/14f0c36ab30e8cd54eb652481d19900a8034f76a)
- update: tests [332c623](https://github.com/commenthol/date-holidays-parser/commit/332c623c01f29f53ffdf93336f2401d4ef672e0c)

## [1.3.0](https://github.com/commenthol/date-holidays-parser/compare/1.2.3...1.3.0)

- regenerate hebrew hijra calendar [0443a0f](https://github.com/commenthol/date-holidays-parser/commit/0443a0fa9b31858b2e3decb06b4d69e8defd7812)
- bump deps [109cbb8](https://github.com/commenthol/date-holidays-parser/commit/109cbb8be9220c34eb07b9b2f984b68c708b786d)
- new rule weekday [130733a](https://github.com/commenthol/date-holidays-parser/commit/130733a5786fa095a636df41cea97936b7252470)

## [1.2.3](https://github.com/commenthol/date-holidays-parser/compare/1.2.2...1.2.3)

- remove node 4 from travis [3eb8411](https://github.com/commenthol/date-holidays-parser/commit/3eb84115bfedb06a3b119f12bd6c2494849d60ac)
- fix issue multiple types [1153d9d](https://github.com/commenthol/date-holidays-parser/commit/1153d9dc4885a13290e9b9f55e5248d987513588)
- add testcase for state name translations [b500227](https://github.com/commenthol/date-holidays-parser/commit/b500227492f8a13ca0f1d908e65a54067b491ffe)

## [1.2.2](https://github.com/commenthol/date-holidays-parser/compare/1.2.1...1.2.2)

- keep bundle sizes small [a5ad9a3](https://github.com/commenthol/date-holidays-parser/commit/a5ad9a3ba5b75256a4b2ba5f2bbef038d1347403)

## [1.2.1](https://github.com/commenthol/date-holidays-parser/compare/1.2.0...1.2.1)

- remove es5 export [44b6c05](https://github.com/commenthol/date-holidays-parser/commit/44b6c0599c3b7a1b017a5c27c09329ef55e318fd)
- babel transpile to es5 [acd8c4e](https://github.com/commenthol/date-holidays-parser/commit/acd8c4eabd82c3568865ad3ca8390ff0b4fb72d3)

## [1.2.0](https://github.com/commenthol/date-holidays-parser/compare/1.1.1...1.2.0)

- moving to own repo [620670f](https://github.com/commenthol/date-holidays-parser/commit/620670f91c759adf4662f0aef208cc3ec286e3b2)
- deleting data files [d6fe195](https://github.com/commenthol/date-holidays-parser/commit/d6fe1953d39a2b241f5e2f436a441cde38a39f25)
- fix: babelify is devDependency [f5ab799](https://github.com/commenthol/date-holidays-parser/commit/f5ab799ea118d634971d50f00b68bef593600d4f)

## [1.1.1](https://github.com/commenthol/date-holidays-parser/compare/1.1.0...1.1.1)

- bump devDependencies [6583ffe](https://github.com/commenthol/date-holidays-parser/commit/6583ffe50b55e3019272d90cd03e2629be590272)
- linting [1c3c805](https://github.com/commenthol/date-holidays-parser/commit/1c3c805cc69cd4ff7c59bfc48494230e4b7e11cb)
- add ES-AR [6aade6d](https://github.com/commenthol/date-holidays-parser/commit/6aade6d40e0c8ae90d22c2f1319323914c6f8e63)

## [1.1.0](https://github.com/commenthol/date-holidays-parser/compare/1.0.1...1.1.0)

- refactor .active filter [c306889](https://github.com/commenthol/date-holidays-parser/commit/c3068898cbb4e9cfe7fcd2ba6cb58ce74552af8e)
- update [0b1f180](https://github.com/commenthol/date-holidays-parser/commit/0b1f180dd2619acc140ccefd4dc01fe3595c6869)
- linting [7fead79](https://github.com/commenthol/date-holidays-parser/commit/7fead7903a8b6634474820e336166902cc31fe9d)
- rewrite tests with _weekday included [59e1fec](https://github.com/commenthol/date-holidays-parser/commit/59e1fecd703a68ed18aeac440c858d6af1093577)
- change attribution marker [a3ab0bb](https://github.com/commenthol/date-holidays-parser/commit/a3ab0bb608a48047624af41628deb34f25cf036d)
- country CC added [87a576c](https://github.com/commenthol/date-holidays-parser/commit/87a576c654694c4b1677402ba00fcb6180a4358e)
- Country Albania added [05f91eb](https://github.com/commenthol/date-holidays-parser/commit/05f91eb46cb323b313088fe4832e50361cfd7a8f)
- fix DE: add Berlin holidays [ee4964b](https://github.com/commenthol/date-holidays-parser/commit/ee4964befb0a6bdd1497587ffdd2fd1d629313c9)
- browser tests [eff2c8a](https://github.com/commenthol/date-holidays-parser/commit/eff2c8a4800ca55651ed4b3a141b96ff50b2323e)
- example for browser [3117a5e](https://github.com/commenthol/date-holidays-parser/commit/3117a5e6199b6f9aaed3fe5db9efd0553e500448)

## [1.0.1](https://github.com/commenthol/date-holidays-parser/compare/1.0.0...1.0.1)

- fix Boxing Day [fd5cf00](https://github.com/commenthol/date-holidays-parser/commit/fd5cf008ef8b42afb255cc0ffef0ee5b1ef32413)
