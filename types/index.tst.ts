import Holidays, { type HolidaysTypes } from 'date-holidays-parser';
import { expect } from 'tstyche';

const data = {
  holidays: {
    CUSTOM: {
      name: {
        en: 'custom'
      },
      langs: [
        'en'
      ],
      days: {
        '01-01': {
          name: {
            en: 'New Year'
          },
          payroll: 2
        },
        '05-01 P5D': {
          name: {
            en: 'Labour Day'
          },
          payroll: 1.5
        },
        '12-25': {
          name: {
            en: 'Christmas'
          }
        }
      }
    }
  }
};

const hd = new Holidays(data);

expect(hd.init('US')).type.toBe<void>();

expect(hd.isHoliday(new Date('2019-01-01'))).type.toBe<HolidaysTypes.Holiday[] | false>();
expect(hd.isHoliday(new Date('2019-02-01'))).type.toBe<HolidaysTypes.Holiday[] | false>();
expect(hd.getHolidays()).type.toBe<HolidaysTypes.Holiday[]>();
