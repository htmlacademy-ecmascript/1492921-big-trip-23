import { BLANK_POINT, Folders, HtmlClasses } from '@src/const.js';
import { formatDateTime } from '@utils/datetime.js';
import AbstractView from '@framework/view/abstract-view.js';

const eventTypeItemTemplate = (name) => {
  const nameLower = name.toLowerCase();
  return `<div class="event__type-item">
    <input id="event-type-${nameLower}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${nameLower}">
    <label class="event__type-label  event__type-label--${nameLower}" for="event-type-${nameLower}-1">${name}</label>
  </div>`;
};

const eventTypeListTemplate = (items) => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
        ${Object.values(items)
          .map((item) => eventTypeItemTemplate(item))
          .join('')}
    </fieldset>
  </div>
`;

const offerTemplate = ({ id, name, price }, checked) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${id}-1">
      <span class="event__offer-title">${name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const offersTemplate = (items, itemsChecked) => `
  ${
    items
      ? `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${Object.values(items)
        .map((item) =>
          offerTemplate(
            item,
            itemsChecked.find((element) => element.id === item.id) !==
              undefined,
          ),
        )
        .join('')}
    </div>
  </section>
`
      : ''
  }`;

const descriptionTemplate = (destination, destinationList, isNew) => {
  const destinationItem = destinationList.find(
    (element) => element.id === destination,
  );

  let picturesTemplate = '';
  if (destinationItem && destinationItem.description) {
    if (isNew) {
      picturesTemplate = `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destinationItem.pictures.map(
              (picture) =>
                `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`,
            )}
          </div>
        </div>`;
    }
    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationItem.description}</p>
        ${picturesTemplate}
      </section>`;
  }
  return '';
};

const editPointTemplate = (
  { type, destination, dateFrom, dateTo, price, offers },
  eventTypeList,
  destinationList,
  offersList,
  isNew,
) => `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${Folders.ICON}${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${eventTypeListTemplate(eventTypeList)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationList.map((item) => `<option value="${item.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateTime(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-start-time" value="${formatDateTime(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${offersTemplate(offersList, offers)}
        ${descriptionTemplate(destination, destinationList, isNew)}
      </section>
    </form>
  </li>
`;

export default class EditPointsView extends AbstractView {
  #point = null;
  #isNewPoint = true;
  #eventTypeList = null;
  #destinationList = null;
  #offerList = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({
    point = BLANK_POINT,
    onFormSubmit,
    onCloseClick,
    eventTypeList,
    destinationList,
    offerList,
  }) {
    super();
    this.#point = point;
    this.#eventTypeList = eventTypeList;
    this.#destinationList = destinationList;
    this.#offerList = offerList;
    this.#isNewPoint = point === BLANK_POINT;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector(`.${HtmlClasses.ROLLUP_BUTTON}`)
      .addEventListener('click', this.#closeClickHandler);
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return editPointTemplate(
      this.#point,
      this.#eventTypeList,
      this.#destinationList,
      this.#offerList,
      this.#isNewPoint,
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };
}
