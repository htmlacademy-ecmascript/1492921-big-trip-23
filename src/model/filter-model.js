import Observable from '@framework/observable.js';
import { DEFAULT_FILTER, FilterItems, IncludeBoundaries } from '@src/const.js';
import { isAfterNow, isBeforeNow } from '@utils/datetime.js';

const FilteringFunction = {
  [FilterItems.EVERYTHING.id]: (points) => points,
  [FilterItems.FUTURE.id]: (points) =>
    points.filter((point) => isAfterNow(point.dateFrom)),
  [FilterItems.PRESENT.id]: (points) =>
    points.filter(
      (point) =>
        isAfterNow(point.dateTo, IncludeBoundaries.YES) &&
        isBeforeNow(point.dateFrom, IncludeBoundaries.YES),
    ),
  [FilterItems.PAST.id]: (points) =>
    points.filter((point) => isBeforeNow(point.dateTo)),
};

const getFilteredPoints = (points, filterValue = DEFAULT_FILTER.id) =>
  FilteringFunction[filterValue](points);
export default class FilterModel extends Observable {
  #activeFilter = DEFAULT_FILTER.id;

  get activeFilter() {
    return this.#activeFilter;
  }

  setFilter(updateType, filterValue, isNotify = true) {
    this.#activeFilter = filterValue;
    if (isNotify) {
      this._notify(updateType, filterValue);
    }
  }
}

export { getFilteredPoints };
