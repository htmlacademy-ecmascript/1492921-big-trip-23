import AbstractView from '@framework/view/abstract-view.js';

const filterItemTemplate = (item, activeFilter) => {
  const { id, name, count } = item;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="${id}" ${count > 0 ? '' : 'disabled'} ${id === activeFilter ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
    </div>
  `;
};

const filtersTemplate = (items, activeFilter) => `
  <form class="trip-filters" action="#" method="get">
    ${items.map((item) => filterItemTemplate(item, activeFilter)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;
export default class FiltersView extends AbstractView {
  #items = null;
  #activeFilter = null;
  #handleFilterChange = null;

  constructor({ filters, activeFilter, onFilterChange }) {
    super();
    this.#items = filters;
    this.#activeFilter = activeFilter;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return filtersTemplate(this.#items, this.#activeFilter);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };
}
