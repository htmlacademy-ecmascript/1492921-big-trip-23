import AbstractView from '@framework/view/abstract-view.js';

const filterItemTemplate = ({ id, name, count }) => `
    <div class="trip-filters__filter">
      <input id="filter-${id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${id}" ${count > 0 ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
    </div>
  `;

const filtersTemplate = (items) => `
  <form class="trip-filters" action="#" method="get">
    ${items.map((item) => filterItemTemplate(item)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;
export default class FiltersView extends AbstractView {
  #items = null;
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({ filters, onFilterChange }) {
    super();
    this.#items = filters;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return filtersTemplate(this.#items);
  }

  get activeFilter() {
    return this.#currentFilter.value;
  }

  set activeFilter(id) {
    if (this.#currentFilter) {
      this.#currentFilter.checked = false;
    }
    this.#currentFilter = this.element.querySelector(`#filter-${id}`);
    this.#currentFilter.checked = true;
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
    this.#currentFilter = evt.target;
  };
}
