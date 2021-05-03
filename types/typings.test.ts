import Holidays from 'date-holidays-parser';

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
            en: 'Laybour Day'
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
hd.init('US');

hd.isHoliday(new Date('2019-01-01')); // $ExpectType false | Holiday[]
hd.isHoliday(new Date('2019-02-01')); // $ExpectType false | Holiday[]
hd.getHolidays(); // $ExpectType Holiday[]
