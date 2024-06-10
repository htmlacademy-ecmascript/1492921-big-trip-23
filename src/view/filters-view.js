import AbstractView from '@framework/view/abstract-view.js';

const filterItemTemplate = ({ name, count }) => `
    <div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${count > 0 ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
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
  #activeFilter = null;
  #handleFilterClick = null;

  constructor({ filters, onClick }) {
    super();
    this.#items = filters;
    this.#handleFilterClick = onClick;
    this.element.addEventListener('change', this.#filterClickHandler);
  }

  get template() {
    return filtersTemplate(this.#items);
  }

  setActiveFilter(FilterName) {
    if (this.#activeFilter) {
      this.#activeFilter.checked = false;
    }
    this.#activeFilter = this.element.querySelector(`#filter-${FilterName}`);
    this.#activeFilter.checked = true;
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterClick(evt.target.value);
    this.setActiveFilter(evt.target.value);
  };
}
