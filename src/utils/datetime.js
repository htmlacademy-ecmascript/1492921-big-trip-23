const getDateTime = (dateTime) => {
  const dateTimeString = new Date(dateTime).toLocaleString('ru-RU');
  const monthString = new Date(dateTime)
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
  const [date, time] = dateTimeString.split(', ');
  const [day, month, year] = date.split('.');
  const [hours, minutes, seconds] = time.split(':');
  return { day, month, year, hours, minutes, seconds, monthString };
};

const getDateISOString = (dateTime) => {
  const { day, month, year } = getDateTime(dateTime);
  return `${year}-${month}-${day}`;
};

const getDateTimeISOString = (dateTime) => {
  const { day, month, year, hours, minutes } = getDateTime(dateTime);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getMonthString = (dateTime) => getDateTime(dateTime).monthString;
const getDayString = (dateTime) => getDateTime(dateTime).day;

const getMonthDayString = (dateTime) => {
  const { day, monthString } = getDateTime(dateTime);
  return `${monthString} ${day}`;
};

const getTimeString = (dateTime) => {
  const { hours, minutes } = getDateTime(dateTime);
  return `${hours}:${minutes}`;
};
const getDateTimeString = (dateTime) => {
  const { day, month, year, hours, minutes } = getDateTime(dateTime);
  return `${day}/${month}/${year.slice(2, 4)} ${hours}:${minutes}`;
};

const getDurationTimeString = (timeStart, timeEnd) => {
  const timeDucation = new Date(new Date(timeEnd) - new Date(timeStart));
  const timeDurationDays = `${timeDucation.toISOString().substring(8, 10)}D `;
  const timeDurationHours = `${timeDucation.toISOString().substring(11, 13)}H `;
  const timeDurationMinute = `${timeDucation.toISOString().substring(14, 16)}M`;
  return `${timeDurationDays === '01D ' ? '' : timeDurationDays}${timeDurationHours === '00H ' ? '' : timeDurationHours}${timeDurationMinute}`;
};

export {
  getDateISOString,
  getDateTimeISOString,
  getMonthDayString,
  getMonthString,
  getDayString,
};
export { getTimeString, getDateTimeString, getDurationTimeString };
