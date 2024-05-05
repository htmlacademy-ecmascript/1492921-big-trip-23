const getDateISOString = (dateTime) => new Date(dateTime).toISOString().substring(0, 10);
const getDateTimeISOString = (dateTime) => new Date(dateTime).toISOString().substring(0, 16);
const getMonthDayString = (dateTime) => new Date(dateTime).toLocaleDateString('en-US', {month: 'short', day: '2-digit'}).toUpperCase();
const getMonthString = (dateTime) => new Date(dateTime).toLocaleDateString('en-US', {month: 'short'}).toUpperCase();
const getDayString = (dateTime) => new Date(dateTime).toLocaleDateString('en-US', {day: '2-digit'});
const getTimeString = (dateTime) => new Date(dateTime).toLocaleTimeString('en-US', {timeStyle: 'short', hourCycle: 'h24'});
const getDateTimeString = (dateTime) => new Date(dateTime).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replace(', ', ' ');

const getDurationTimeString = (timeStart, timeEnd) => {
  if (getDateISOString(timeStart) !== getDateISOString(timeEnd)) {
    throw 'Начало и окончание одного события должно быть в один день!';
  }
  const timeDucation = new Date(new Date(timeEnd) - new Date(timeStart));
  const timeDurationHours = `${timeDucation.toISOString().substring(11, 13)}H `;
  const timeDurationMinute = `${timeDucation.toISOString().substring(14, 16)}M`;
  return `${timeDurationHours === '00H ' ? '' : timeDurationHours}${timeDurationMinute}`;
};

export {getDateISOString, getDateTimeISOString, getMonthDayString, getMonthString, getDayString};
export {getTimeString, getDateTimeString, getDurationTimeString};

