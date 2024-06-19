import {
  DEFAULT_FILTER,
  DEFAULT_SORTING,
  FilterItems,
  IsNotify,
  SortingItems,
  UpdateType,
} from '@src/const.js';
import { remove, render, RenderPosition } from '@framework/render.js';
import SortingView from '@view/sorting-view.js';
import PointListView from '@view/point-list-view.js';
import MessageView from '@view/message-view.js';
import PointPresenter from '@presenter/point-presenter.js';
import NewPointPresenter from '@presenter/new-point-presenter.js';
import { getFilteredPoints } from '@model/filter-model.js';
import PointListModel from '@model/point-list-model.js';
export default class PointListPresenter {
  #container = null;
  #pointListModel = null;
  #eventTypeListModel = null;
  #destinationListModel = null;
  #offerListModel = null;
  #filterModel = null;

  #pointListView = new PointListView();
  #sortingView = null;
  #messageView = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #handleNewPointDestroy = null;

  #currentSorting = DEFAULT_SORTING.id;
  #activeFilter = DEFAULT_FILTER.id;

  constructor({
    container,
    pointListModel,
    eventTypeListModel,
    destinationListModel,
    offerListModel,
    filterModel,
    onNewPointDestroy,
  }) {
    this.#container = container;
    this.#pointListModel = pointListModel;
    this.#eventTypeListModel = eventTypeListModel;
    this.#destinationListModel = destinationListModel;
    this.#offerListModel = offerListModel;
    this.#filterModel = filterModel;

    this.#handleNewPointDestroy = onNewPointDestroy;

    this.#pointListModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get shownPoints() {
    this.#activeFilter = this.#filterModel.activeFilter;
    const filteredPoints = getFilteredPoints(
      this.#pointListModel.points,
      this.#activeFilter,
    );
    return PointListModel.getSortedItems(filteredPoints, this.#currentSorting);
  }

  init() {
    this.#refreshPoints();
  }

  insertPoint() {
    //this.#currentSortType = SortType.DEFAULT;
    //this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#handleModeChange();
    this.#newPointPresenter = new NewPointPresenter({
      container: this.#pointListView.element,
      eventTypeListModel: this.#eventTypeListModel,
      destinationListModel: this.#destinationListModel,
      offerListModel: this.#offerListModel,
      onDataChange: this.#handleInsertPoints,
      onDestroy: this.#handleNewPointDestroy,
    });
    this.#newPointPresenter.init();
    //this.#pointPresenters.set(point.id, this.#newPointPresenter);
  }

  #refreshPoints() {
    const points = this.shownPoints;
    this.#clearPoints();
    if (points.length === 0) {
      this.#showMessage(
        FilterItems[this.#activeFilter.toUpperCase()].emptyMessage,
      );
      return;
    }
    remove(this.#messageView);
    if (!this.#sortingView) {
      this.#renderSorting();
      render(this.#pointListView, this.#container);
    }
    this.#renderPoints(points);
  }

  #clearPointList() {
    this.#currentSorting = DEFAULT_SORTING.id;
    remove(this.#pointListView);
    remove(this.#sortingView);
    this.#sortingView = null;
  }

  #clearPoints() {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderSorting() {
    this.#sortingView = new SortingView({
      items: SortingItems,
      currentSorting: this.#currentSorting,
      onSortingChange: this.#handleSortingChange,
    });
    render(this.#sortingView, this.#container, RenderPosition.AFTERBEGIN);
    this.#sortingView.setActiveItem = DEFAULT_SORTING.id;
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#pointListView.element,
      eventTypeListModel: this.#eventTypeListModel,
      destinationListModel: this.#destinationListModel,
      offerListModel: this.#offerListModel,
      currentSorting: this.#currentSorting,
      onDataChange: this.#handleUpdatePoints,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #showMessage(message) {
    remove(this.#sortingView);
    remove(this.#pointListView);
    this.#messageView = new MessageView(message);
    render(this.#messageView, this.#container);
  }

  #handleModeChange = () => {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortingChange = (sortingId) => {
    this.#currentSorting = sortingId;
    this.#refreshPoints();
  };

  #handleUpdatePoints = (actionType, updateType, point) => {
    this.#pointListModel.updateItems(actionType, updateType, point);
  };

  #handleInsertPoints = (actionType, updateType, point) => {
    this.#filterModel.setFilter(updateType, DEFAULT_FILTER.id, IsNotify.NO);
    this.#handleUpdatePoints(actionType, updateType, point);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case (UpdateType.PATCH, UpdateType.SMALL):
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#refreshPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList();
        this.#refreshPoints();
        break;
    }
  };
}
