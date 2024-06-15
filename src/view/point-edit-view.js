import { BLANK_POINT, Folders, HtmlClasses } from '@src/const.js';
import { formatDateTime } from '@utils/datetime.js';
import AbstractView from '@framework/view/abstract-stateful-view.js';

const eventTypeItemTemplate = (item) => `
  <div class="event__type-item">
    <input id="event-type-${item.id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.id}">
    <label class="event__type-label  event__type-label--${item.id}" for="event-type-${item.id}-1">${item.name}</label>
  </div>`;

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

const offerTemplate = (item, checked) => {
  const { id, title, price } = item;
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${id}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
  `;
};

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

const descriptionTemplate = (destinationInfo) => {
  if (!destinationInfo) {
    return '';
  }
  const { description, pictures } = destinationInfo;
  let descriptionHtml = '';
  if (description) {
    descriptionHtml = `<p class="event__destination-description">${description}</p>`;
  }
  let picturesHtml = '';
  if (pictures && pictures.length > 0) {
    picturesHtml = `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map(
            (picture) =>
              `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`,
          )}
        </div>
      </div>`;
  }
  if (descriptionHtml || picturesHtml) {
    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${descriptionHtml}
        ${picturesHtml}
      </section>`;
  }
  return '';
};

const editPointTemplate = (state, eventTypeList, destinationList) => {
  const { type, dateFrom, dateTo, price, typeName, offers } = state.point;
  return `
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
            ${typeName}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${state.destinationInfo.name}" list="destination-list-1">
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
        ${offersTemplate(state.availableOffers, offers)}
        ${descriptionTemplate(state.destinationInfo)}
      </section>
    </form>
  </li>
  `;
};

export default class PointEditView extends AbstractView {
  #eventTypeList = null;
  #destinationList = null;
  #handleFormSubmit = null;
  #handleBtnRollupClick = null;

  constructor({
    point = BLANK_POINT,
    eventTypeList,
    destinationList,
    offerList,
    onFormSubmit,
    onBtnRollupClick,
  }) {
    super();
    this.#eventTypeList = eventTypeList;
    this.#destinationList = destinationList;
    this._setState(
      PointEditView.parsePointToState(point, offerList, destinationList),
    );
    this.#handleFormSubmit = onFormSubmit;
    this.#handleBtnRollupClick = onBtnRollupClick;
    this._restoreHandlers();
  }

  get template() {
    return editPointTemplate(
      this._state,
      this.#eventTypeList,
      this.#destinationList,
    );
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector(`.${HtmlClasses.ROLLUP_BUTTON}`)
      .addEventListener('click', this.#btnRollupClickHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #btnRollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnRollupClick();
  };

  static parsePointToState(point, offerList, destinationList) {
    return {
      point: { ...point },
      availableOffers: offerList[point.type],
      destinationInfo: destinationList.find(
        (element) => element.id === point.destination,
      ),
    };
  }

  static parseStateToPoint(state) {
    return { ...state.point };
  }
}
