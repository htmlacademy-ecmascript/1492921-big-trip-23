import {
  BLANK_POINT,
  ButtonTypes,
  Folders,
  FormMode,
  HtmlClasses,
} from '@src/const.js';
import { formatDateTime } from '@utils/datetime.js';
import AbstractStatefulView from '@framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Input = {
  DATE_FROM: 'event-start-time',
  DATE_TO: 'event-end-time',
};

const eventTypeItemTemplate = (item) => `
  <div class="event__type-item">
    <input id="event-type-${item.id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.id}">
    <label class="event__type-label  event__type-label--${item.id}" for="event-type-${item.id}-1">${item.name}</label>
  </div>`;

const eventTypeListTemplate = (items) => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${Object.values(items).map((item) => eventTypeItemTemplate(item)).join('')}
    </fieldset>
  </div>
`;

const offerTemplate = (item, checked) => {
  const { id, title, price } = item;
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox"
      data-id="${id}" name="event-offer-${id}" ${checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${id}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
  `;
};

const offersTemplate = (items, itemsChecked) => `
  ${items && items.length > 0 ? `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${Object.values(items).map((item) => offerTemplate(item, itemsChecked.find((element) => element === item.id) !== undefined)).join('')}
    </div>
  </section>` : ''}
  `;

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
          ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)}
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

const editPointTemplate = (
  state,
  eventTypeList,
  destinationList,
  offerList,
  mode
) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    price,
    offers,
    isSaving,
    isDeleting,
  } = state;
  const saveCaption = isSaving ? ButtonTypes.SAVING : ButtonTypes.SAVE;
  const deleteCaption = isDeleting ? ButtonTypes.DELETING : ButtonTypes.DELETE;
  const resetCaption =
    mode === FormMode.INSERTING ? ButtonTypes.CANCEL : deleteCaption;

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17"
              src="${Folders.ICON}${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${eventTypeListTemplate(eventTypeList)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventTypeList[type].name}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${destinationList[destination] ? destinationList[destination].nam : ''}
            " list="destination-list-1" required
          >
          <datalist id="destination-list-1">
            ${Object.values(destinationList).map((item) => `<option value="${item.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${formatDateTime(dateFrom)}"
            autocomplete="off"
            required
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${formatDateTime(dateTo)}"
            autocomplete="off"
            required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text"
            name="event-price" value="${price}" title="Требуется целое положительное число" pattern="[0-9]+$" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit"}>${saveCaption}</button>
        <button class="event__reset-btn" type="reset">${resetCaption}</button>
        ${mode === FormMode.INSERTING ? '' : `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        `}
      </header>

      <section class="event__details">
        ${offerList[type] ? offersTemplate(Object.values(offerList[type]), offers) : ''}
        ${descriptionTemplate(destinationList[destination])}
      </section>
    </form>
  </li>
  `;
};
export default class PointEditView extends AbstractStatefulView {
  #eventTypeList = null;
  #destinationList = null;
  #offerList = null;
  #handleFormSubmit = null;
  #handleBtnDeleteClick = null;
  #handleFormClose = null;
  #dates = {};
  #mode = null;

  constructor({
    point = BLANK_POINT,
    eventTypeList,
    destinationList,
    offerList,
    onFormSubmit,
    onBtnDeleteClick,
    onBtnRollupClick,
    formMode = FormMode.EDITING,
  }) {
    super();
    this.#eventTypeList = eventTypeList;
    this.#destinationList = destinationList;
    this.#offerList = offerList;
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleBtnDeleteClick = onBtnDeleteClick;
    this.#handleFormClose = onBtnRollupClick;
    this.#mode = formMode;
    this._restoreHandlers();
  }

  get template() {
    return editPointTemplate(
      this._state,
      this.#eventTypeList,
      this.#destinationList,
      this.#offerList,
      this.#mode
    );
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector(`.${HtmlClasses.DELETE_BUTTON}`)
      .addEventListener('click', this.#btnDeleteClickHandler);
    if (this.#mode === FormMode.EDITING) {
      this.element
        .querySelector(`.${HtmlClasses.ROLLUP_BUTTON}`)
        .addEventListener('click', this.#btnRollupClickHandler);
    }
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
      .forEach((element) => {
        this.#setDatepicker(element);
      });
    this.element
      .querySelectorAll(`.${HtmlClasses.EVENT_OFFER}`)
      .forEach((element) =>
        element.addEventListener('change', this.#offerChangeHandler)
      );
  }

  removeElement() {
    super.removeElement();
    Object.values(this.#dates).forEach((element) => {
      element.destroy();
      element = null;
    });
  }

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  #setDatepicker(element) {
    this.#dates[element.name] = flatpickr(element, {
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      maxDate: element.name === Input.DATE_FROM ? this._state.dateTo : null,
      minDate: element.name === Input.DATE_TO ? this._state.dateFrom : null,
      dateFormat: 'd/m/y H:i',
      allowInput: true,
      onChange: this.#timeChangeHandler,
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #btnDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #btnRollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destionationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: Object.keys(this.#destinationList).find(
        (key) => this.#destinationList[key].name === evt.target.value
      ),
    });
  };

  #timeChangeHandler = ([dateTime], dateStr, instance) => {
    if (instance.element.name === Input.DATE_FROM) {
      this._setState({ dateFrom: dateTime });
      this.#dates[Input.DATE_TO].set('minDate', dateTime);
      return;
    }
    this._setState({ dateTo: dateTime });
    this.#dates[Input.DATE_FROM].set('maxDate', dateTime);
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({ price: Number(evt.target.value) });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.checked) {
      const offersNew = this._state.offers ?? [];
      offersNew.push(evt.target.dataset.id);
      this._setState({
        offers: offersNew,
      });
    } else {
      this._setState({
        offers: this._state.offers.filter(
          (item) => evt.target.dataset.id !== item
        ),
      });
    }
  };

  static parsePointToState(point) {
    return {
      ...point,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    delete state.isSaving;
    delete state.isDeleting;
    return state;
  }
}
