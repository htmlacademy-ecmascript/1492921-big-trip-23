import { remove, render, replace } from '@framework/render.js';
import { FilterItems, UpdateType } from '@src/const.js';
import FiltersView from '@view/filters-view.js';
import { getFilteredPoints } from '@model/filter-model.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointListModel = null;

  #filterView = null;

  constructor({ container, filterModel, pointListModel }) {
    this.#container = container;
    this.#pointListModel = pointListModel;
    this.#filterModel = filterModel;

    this.#pointListModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(FilterItems).map((item) => ({
      id: item.id,
      name: item.name,
      count: getFilteredPoints(this.#pointListModel.points, item.id).length,
    }));
  }

  init() {
    const prevFilterView = this.#filterView;

    this.#filterView = new FiltersView({
      filters: this.filters,
      activeFilter: this.#filterModel.activeFilter,
      onFilterChange: this.#handleFilterChange,
    });

    if (prevFilterView === null) {
      render(this.#filterView, this.#container);
      return;
    }

    replace(this.#filterView, prevFilterView);
    remove(prevFilterView);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filterValue) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterValue);
  };
}
