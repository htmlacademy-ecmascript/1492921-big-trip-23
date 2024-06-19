import AbstractView from '@framework/view/abstract-view.js';

const sortItemTemplate = (item, currentSorting) => {
  const { id, name, isCanSort } = item;
  return `
    <div class="trip-sort__item  trip-sort__item--${id}">
      <input id="sort-${id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-id="${id}"
        value="sort-${id}" ${!isCanSort ? 'disabled' : ''} ${id === currentSorting ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-${id}">${name}</label>
    </div>
  `;
};

const sortingTemplate = (items, currentSorting) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(items)
      .map((item) => sortItemTemplate(item, currentSorting))
      .join('')}
  </form>
`;
export default class SortingView extends AbstractView {
  #items = null;
  #currentSorting = null;
  #handleSortingChange = null;

  constructor({ items, currentSorting, onSortingChange }) {
    super();
    this.#items = items;
    this.#currentSorting = currentSorting;
    this.#handleSortingChange = onSortingChange;
    this.element.addEventListener('change', this.#sortingChangeHandler);
  }

  get template() {
    return sortingTemplate(this.#items, this.#currentSorting);
  }

  #sortingChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortingChange(evt.target.dataset.id);
  };
}
