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
  FAVORITE_BUTTON: 'event__favorite-btn',
};

const MAX_DESTINATION_IN_TRIP_INFO = 3;

const FilterItems = {
  EVERYTHING: {
    id: 'everything',
    name: 'Everything',
    emptyMessage: 'Click New Event to create your first point',
  },
  FUTURE: {
    id: 'future',
    name: 'Future',
    emptyMessage: 'There are no future events now',
  },
  PRESENT: {
    id: 'present',
    name: 'Present',
    emptyMessage: 'There are no present events now',
  },
  PAST: {
    id: 'past',
    name: 'Past',
    emptyMessage: 'There are no past events now',
  },
};
const INIT_FILTER_ITEM = FilterItems.EVERYTHING;

const SortingItems = {
  DAY: { id: 'day', name: 'Day', isCanSort: true },
  EVENT: { id: 'event', name: 'Event', isCanSort: false },
  TIME: { id: 'time', name: 'Time', isCanSort: true },
  PRICE: { id: 'price', name: 'Price', isCanSort: true },
  OFFERS: { id: 'offers', name: 'Offers', isCanSort: false },
};
const INIT_SORT_ITEM = SortingItems.DAY;

const EventTypes = {
  TAXI: { id: 'taxi', name: 'Такси' },
  BUS: { id: 'bus', name: 'Bus' },
  TRAIN: { id: 'train', name: 'Train' },
  SHIP: { id: 'ship', name: 'Ship' },
  DRIVE: { id: 'drive', name: 'Drive' },
  FLIGHT: { id: 'flight', name: 'Полет' },
  CHECK_IN: { id: 'check-in', name: 'Check-in' },
  SIGHTSEEING: { id: 'sightseeing', name: 'Sightseeing' },
  RESTAURANT: { id: 'restaurant', name: 'Restaurant' },
};

const IncludeBoundaries = {
  YES: true,
  NO: false,
};

export {
  BLANK_POINT,
  DateTimeFormats,
  Folders,
  HtmlClasses,
  MAX_DESTINATION_IN_TRIP_INFO,
  FilterItems,
  SortingItems,
  EventTypes,
  IncludeBoundaries,
  INIT_FILTER_ITEM,
  INIT_SORT_ITEM,
};
