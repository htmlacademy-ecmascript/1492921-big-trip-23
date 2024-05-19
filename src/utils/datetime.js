import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DateTimeFormats = {
  DATE_TIME_ISO: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'DD/MM/YY HH:mm',
  DATE_ISO: 'YYYY-MM-DD',
  DAY_MONTH: 'DD MMM',
  MONTH_DAY: 'MMM DD',
  TIME: 'HH:mm',
};

const getDateISOString = (dateTime) =>
  dayjs(dateTime).format(DateTimeFormats.DATE_ISO);

const getDateTimeISOString = (dateTime) =>
  dayjs(dateTime).format(DateTimeFormats.DATE_TIME_ISO);

const getMonthDayString = (dateTime) =>
  dayjs(dateTime).format(DateTimeFormats.MONTH_DAY);

const getDayMonthString = (dateTime) =>
  dayjs(dateTime).format(DateTimeFormats.DAY_MONTH);

const getTimeString = (dateTime) =>
  dayjs(dateTime).format(DateTimeFormats.TIME);

const getDateTimeString = (dateTime) =>
  dayjs(dateTime).format(DateTimeFormats.DATE_TIME);

const getDurationTimeString = (dateFrom, dateTo) => {
  const diffDates = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = Math.floor(diffDates.asDays());
  const hours = Math.floor(diffDates.asHours());
  const hoursTemplate = hours >= 1 ? 'HH[H] ' : '';
  return diffDates.format(
    `${days >= 1 ? `[${days}D] HH[H] ` : hoursTemplate}mm[M]`,
  );
};

export {
  getDateISOString,
  getDateTimeISOString,
  getMonthDayString,
  getDayMonthString,
  getTimeString,
  getDateTimeString,
  getDurationTimeString,
};
