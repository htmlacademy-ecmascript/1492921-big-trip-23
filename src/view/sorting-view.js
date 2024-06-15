import AbstractView from '@framework/view/abstract-view.js';

const sortItemTemplate = ({ id, name, isCanSort }) => `
  <div class="trip-sort__item  trip-sort__item--${id}">
    <input id="sort-${id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${id}" ${!isCanSort ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${id}">${name}</label>
  </div>
`;

const sortingTemplate = (items) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(items)
      .map((item) => sortItemTemplate(item))
      .join('')}
  </form>
`;

export default class SortingView extends AbstractView {
  #items = null;
  #curentSorting = null;
  #handleSortingChange = null;

  constructor({ items, onSortingChange }) {
    super();
    this.#items = items;
    this.#handleSortingChange = onSortingChange;
    this.element.addEventListener('change', this.#sortingChangeHandler);
  }

  get template() {
    return sortingTemplate(this.#items);
  }

  get activeSorting() {
    return this.#curentSorting.value.split('-')[1];
  }

  set activeSorting(id) {
    if (this.#curentSorting) {
      this.#curentSorting.checked = false;
    }
    this.#curentSorting = this.element.querySelector(`#sort-${id}`);
    this.#curentSorting.checked = true;
  }

  #sortingChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortingChange(evt.target.value.split('-')[1]);
    this.#curentSorting = evt.target;
  };
}
