import { FilterItems } from '@model/data-model.js';
import { isAfterNow, isBeforeNow } from '@utils/datetime.js';
import { FilterMessages, IncludeBoundaries } from '@src/const.js';
import { render } from '@framework/render.js';

const filter = {
  [FilterItems.EVERYTHING]: (points) => points,
  [FilterItems.FUTURE]: (points) =>
    points.filter((point) => isAfterNow(point.dateTo)),
  [FilterItems.PRESENT]: (points) =>
    points.filter(
      (point) =>
        isAfterNow(point.dateFrom, IncludeBoundaries.YES) &&
        isBeforeNow(point.dateTo, IncludeBoundaries.YES),
    ),
  [FilterItems.PAST]: (points) =>
    points.filter((point) => isBeforeNow(point.dateTo)),
};

import FiltersView from '@view/filters-view.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filterPoints = {};
  #filters = [];
  //#activeFilter = ;
  #filterView = null;
  #handleRefresh = null;
  #handleEmptyFilter = null;

  constructor({ points, onRefresh, container, onEmptyFilter }) {
    this.#filtersContainer = container;
    this.#handleRefresh = onRefresh;
    this.#handleEmptyFilter = onEmptyFilter;
    this.#filters = Object.entries(filter).map(([filterName, filterPoints]) => {
      this.#filterPoints[filterName] = filterPoints(points);
      return {
        name: filterName,
        count: this.#filterPoints[filterName].length,
      };
    });
  }

  // Рендеринг фильтров
  #renderFiltres() {
    this.#filterView = new FiltersView({
      filters: this.#filters,
      onClick: (filterName) => this.setFilter(filterName),
    });
    render(this.#filterView, this.#filtersContainer);
  }

  // Инициализация презентера
  init() {
    this.#renderFiltres();
  }

  setFilter = (filterName) => {
    this.#filterView.setActiveFilter(filterName);
    if (this.#filterPoints[filterName].length > 0) {
      this.#handleRefresh(this.#filterPoints[filterName]);
    } else {
      this.#handleEmptyFilter(FilterMessages[filterName.toUpperCase()]);
    }
  };
}
