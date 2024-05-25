import AbstractView from '@framework/view/abstract-view.js';

const sortItemTemplate = (name) => {
  const nameLower = name.toLowerCase();
  return `
    <div class="trip-sort__item  trip-sort__item--${nameLower}">
      <input id="sort-${nameLower}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${nameLower}">
      <label class="trip-sort__btn" for="sort-${nameLower}">${name}</label>
    </div>
  `;
};

const sortingTemplate = (items) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(items)
      .map((item) => sortItemTemplate(item))
      .join('')}
  </form>
`;

export default class SortingView extends AbstractView {
  constructor(items) {
    super();
    this.items = items;
  }

  get template() {
    return sortingTemplate(this.items);
  }
}
