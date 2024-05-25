import AbstractView from '@framework/view/abstract-view.js';

const filterItemTemplate = (name) => {
  const nameLower = name.toLowerCase();
  return `
    <div class="trip-filters__filter">
      <input id="filter-${nameLower}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${nameLower}">
      <label class="trip-filters__filter-label" for="filter-${nameLower}">${name}</label>
    </div>
  `;
};

const filtersTemplate = (items) => `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${Object.values(items)
        .map((item) => filterItemTemplate(item))
        .join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
`;

export default class FiltersView extends AbstractView {
  constructor(items) {
    super();
    this.items = items;
  }

  get template() {
    return filtersTemplate(this.items);
  }
}
