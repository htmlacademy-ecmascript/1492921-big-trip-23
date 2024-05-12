import {createElement} from '../render.js';

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
    ${items.map((item) => sortItemTemplate(item)).join('')}
  </form>
`;

export default class SortingView {
  constructor(items) {
    this.items = items;
  }

  getTemplate = () => sortingTemplate(this.items);

  getElement = () => {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  };

  removeElement = () => {
    this.element = null;
  };
}
