import {
  BLANK_POINT,
  Folders,
  HtmlClasses,
  OFFER_ELEMENT_NAME_PREFIX,
} from '@src/const.js';
import { formatDateTime } from '@utils/datetime.js';
import AbstractView from '@framework/view/abstract-stateful-view.js';
import { getEventType } from '@model/data-model.js';

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
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="${OFFER_ELEMENT_NAME_PREFIX}${id}" ${checked ? 'checked' : ''}>
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
  const {
    eventType,
    destination,
    availableOffers,
    dateFrom,
    dateTo,
    price,
    offers,
  } = state;
  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${Folders.ICON}${eventType.id.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${eventTypeListTemplate(eventTypeList)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType.name}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required>
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
        ${offersTemplate(availableOffers, offers)}
        ${descriptionTemplate(destination)}
      </section>
    </form>
  </li>
  `;
};

export default class PointEditView extends AbstractView {
  #eventTypeList = null;
  #destinationListModel = null;
  #offerListModel = null;
  #handleFormSubmit = null;
  #handleBtnRollupClick = null;

  constructor({
    point = BLANK_POINT,
    eventTypeList,
    destinationListModel,
    offerListModel,
    onFormSubmit,
    onBtnRollupClick,
  }) {
    super();
    this.#eventTypeList = eventTypeList;
    this.#destinationListModel = destinationListModel;
    this.#offerListModel = offerListModel;
    this._setState(
      PointEditView.parsePointToState(
        point,
        this.#destinationListModel,
        this.#offerListModel,
      ),
    );
    this.#handleFormSubmit = onFormSubmit;
    this.#handleBtnRollupClick = onBtnRollupClick;
    this._restoreHandlers();
  }

  get template() {
    return editPointTemplate(
      this._state,
      this.#eventTypeList,
      this.#destinationListModel.items,
    );
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector(`.${HtmlClasses.ROLLUP_BUTTON}`)
      .addEventListener('click', this.#btnRollupClickHandler);
    this.element
      .querySelector(`.${HtmlClasses.EVENT_TYPE}`)
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element
      .querySelector(`.${HtmlClasses.EVENT_DESTINATION}`)
      .addEventListener('change', this.#destionationChangeHandler);
    this.element
      .querySelector(`.${HtmlClasses.EVENT_PRICE}`)
      .addEventListener('change', this.#priceChangeHandler);
    this.element
      .querySelectorAll(`.${HtmlClasses.EVENT_TIME}`)
      .forEach((element) =>
        element.addEventListener('change', this.#timeChangeHandler),
      );
    this.element
      .querySelectorAll(`.${HtmlClasses.EVENT_OFFER}`)
      .forEach((element) =>
        element.addEventListener('change', this.#offerChangeHandler),
      );
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(
        point,
        this.#destinationListModel,
        this.#offerListModel,
      ),
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #btnRollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnRollupClick();
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      eventType: getEventType(evt.target.value),
      availableOffers: this.#offerListModel.items[evt.target.value],
      offers: [],
    });
  };

  #destionationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinationListModel.getItemByName(evt.target.value),
    });
  };

  #timeChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      [evt.target.name === 'event-start-time' ? 'dateFrom' : 'dateTo']:
        evt.target.value,
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.checked) {
      const offersNew = this._state.offers ?? [];
      offersNew.push(
        this._state.availableOffers[
          evt.target.name.slice(OFFER_ELEMENT_NAME_PREFIX.length)
        ],
      );
      this._setState({
        offers: offersNew,
      });
    } else {
      this._setState({
        offers: this._state.offers.filter(
          (item) => evt.target.name !== `event-offer-${item.id}`,
        ),
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({ price: evt.target.value });
  };

  static parsePointToState(point, destinationListModel, offerListModel) {
    return {
      ...point,
      eventType: getEventType(point.type),
      destination: destinationListModel.getItemById(point.destination),
      availableOffers: offerListModel.items[point.type],
    };
  }

  static parseStateToPoint(state) {
    return {
      id: state.id,
      type: state.eventType.id,
      destination: state.destination.id,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
      price: state.price,
      offers: state.offers,
      typeName: state.eventType.name,
      destinationName: state.destination.name,
      offersCost: state.offers.reduce((sum, offer) => sum + offer.price, 0),
      isFavorite: state.isFavorite,
    };
  }
}
