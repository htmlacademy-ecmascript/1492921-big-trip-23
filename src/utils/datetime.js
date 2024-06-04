import { DateTimeFormats } from '@src/const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const formatDateTime = (dueDateTime, format = DateTimeFormats.DATE_TIME) =>
  dueDateTime ? dayjs(dueDateTime).format(format) : '';

const getDurationTimeString = (dateFrom, dateTo) => {
  const diffDates = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = Math.floor(diffDates.asDays());
  const hours = Math.floor(diffDates.asHours());
  const hoursTemplate = hours >= 1 ? 'HH[H] ' : '';
  return diffDates.format(
    `${days >= 1 ? `[${days}D] HH[H] ` : hoursTemplate}mm[M]`,
  );
};

export { formatDateTime, getDurationTimeString };
