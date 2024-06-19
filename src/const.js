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
  type: 'flight',
  destination: '',
  dateFrom: null,
  dateTo: null,
  price: 0,
  offers: [],
};

const HtmlClasses = {
  ROLLUP_BUTTON: 'event__rollup-btn',
  FAVORITE_BUTTON: 'event__favorite-btn',
  DELETE_BUTTON: 'event__reset-btn',
  INSERT_BUTTON: 'trip-main__event-add-btn',
  EVENT_TYPE: 'event__type-group',
  EVENT_DESTINATION: 'event__input--destination',
  EVENT_PRICE: 'event__input--price',
  EVENT_TIME: 'event__input--time',
  EVENT_OFFER: 'event__offer-checkbox',
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
const DEFAULT_FILTER = FilterItems.EVERYTHING;

const SortingItems = {
  DAY: { id: 'day', name: 'Day', isCanSort: true },
  EVENT: { id: 'event', name: 'Event', isCanSort: false },
  TIME: { id: 'time', name: 'Time', isCanSort: true },
  PRICE: { id: 'price', name: 'Price', isCanSort: true },
  OFFERS: { id: 'offers', name: 'Offers', isCanSort: false },
};
const DEFAULT_SORTING = SortingItems.DAY;

const IncludeBoundaries = {
  YES: true,
  NO: false,
};

const IsNotify = {
  YES: true,
  NO: false,
};

const ActionType = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

const UpdateType = {
  PATCH: 'PATCH',
  SMALL: 'SMALL',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FormMode = {
  INSERTING: 'INSERTING',
  EDITING: 'EDITING',
  VIEWING: 'VIEWING',
};

const CaptionBtnDelete = {
  INSERTING: 'Cancel',
  EDITING: 'Delete',
};

export {
  BLANK_POINT,
  //BLANK_POINT_ID,
  DateTimeFormats,
  Folders,
  HtmlClasses,
  MAX_DESTINATION_IN_TRIP_INFO,
  FilterItems,
  SortingItems,
  IncludeBoundaries,
  DEFAULT_FILTER,
  DEFAULT_SORTING,
  ActionType,
  UpdateType,
  FormMode,
  CaptionBtnDelete,
  IsNotify,
};
