const DateTimeFormats = {
  DATE_TIME_ISO: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'DD/MM/YY HH:mm',
  DATE_ISO: 'YYYY-MM-DD',
  DAY_MONTH: 'DD MMM',
  MONTH_DAY: 'MMM DD',
  TIME: 'HH:mm',
};

const Folders = {
  ICON: 'img/icons/',
};

const BLANK_POINT = {
  type: 'Flight',
  destination: 'Paris',
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  price: 0,
  offers: [],
};

const HtmlClasses = {
  ROLLUP_BUTTON: 'event__rollup-btn',
};
export { BLANK_POINT, DateTimeFormats, Folders, HtmlClasses };
