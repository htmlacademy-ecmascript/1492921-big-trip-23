import { isAfterNow, isBeforeNow } from '@utils/datetime.js';
import {
  FilterItems,
  IncludeBoundaries,
  INIT_FILTER_ITEM,
} from '@src/const.js';
import { render } from '@framework/render.js';
import FiltersView from '@view/filters-view.js';

const filter = {
  [FilterItems.EVERYTHING.id]: (points) => points,
  [FilterItems.FUTURE.id]: (points) =>
    points.filter((point) => isAfterNow(point.dateTo)),
  [FilterItems.PRESENT.id]: (points) =>
    points.filter(
      (point) =>
        isAfterNow(point.dateFrom, IncludeBoundaries.YES) &&
        isBeforeNow(point.dateTo, IncludeBoundaries.YES),
    ),
  [FilterItems.PAST.id]: (points) =>
    points.filter((point) => isBeforeNow(point.dateTo)),
};
export default class FilterPresenter {
  #filtersContainer = null;
  #filterPoints = {};
  #filters = [];
  #filterView = null;
  #handleRefresh = null;
  #handleEmptyFilter = null;

  constructor({ points, container, onRefresh, onEmptyFilter }) {
    this.#filtersContainer = container;
    this.#handleRefresh = onRefresh;
    this.#handleEmptyFilter = onEmptyFilter;

    this.#filters = Object.entries(filter).map(([id, filterPoints]) => {
      this.#filterPoints[id] = filterPoints(points);
      return {
        id: id,
        name: FilterItems[id.toUpperCase()].name,
        count: this.#filterPoints[id].length,
      };
    });
  }

  // Инициализация презентера
  init() {
    this.#renderFiltres();
  }

  // Фиьтрация данных
  setFilter = (filterId) => {
    //this.#filterView.setActiveFilter(filterName);
    if (this.#filterPoints[filterId].length === 0) {
      this.#handleEmptyFilter(FilterItems[filterId.toUpperCase()].emptyMessage);
      return;
    }
    this.#handleEmptyFilter(null);
    this.#handleRefresh(this.#filterPoints[filterId]);
  };

  // Рендеринг фильтров
  #renderFiltres() {
    this.#filterView = new FiltersView({
      filters: this.#filters,
      onFilterChange: this.setFilter,
    });
    render(this.#filterView, this.#filtersContainer);
    this.#filterView.activeFilter = INIT_FILTER_ITEM.id;
  }
}
