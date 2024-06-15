import { EventTypes, INIT_SORT_ITEM, SortingItems } from '@src/const.js';
import { render, RenderPosition } from '@framework/render.js';
import SortingView from '@view/sorting-view.js';
import PointListView from '@view/point-list-view.js';
import PointPresenter from '@presenter/point-presenter.js';
import dayjs from 'dayjs';
import { DestinationListModel } from '@model/data-model.js';

//import BoardView from '../view/board-view.js';
//import {updateItem} from '../utils/common.js';
//import {sortTaskUp, sortTaskDown} from '../utils/task.js';
//import {SortType} from '../const.js';

export default class PointListPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #pointListView = new PointListView();
  #sortingView = null;
  #pointEdit = null;

  #destinationList = new DestinationListModel().items;
  #offerList = null;

  //#boardComponent = new BoardView();
  //#taskListComponent = new TaskListView();
  //# adMoreButtonComponent = null;
  //#noTaskComponent = new NoTaskView();

  #sourcedPoints = [];
  #shownPoints = [];

  #pointPresenters = new Map();

  //#currentSortType = INIT_SORT_ITEM;

  constructor({ tripEventsContainer, pointsModel, offerListModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offerList = offerListModel.items;
  }

  init() {
    this.#sourcedPoints = [...this.#pointsModel.pointList];
    this.#shownPoints = [...this.#pointsModel.pointList];
    this.#renderPointList();
  }

  refreshPoints = (points = this.#shownPoints) => {
    this.#clearPoints();
    if (points !== this.#shownPoints) {
      this.#shownPoints = [...points];
      this.#sortingView.activeSorting = INIT_SORT_ITEM.id;
    }
    this.#renderPoints();
  };

  #renderPointList() {
    this.#renderSorting();
    render(this.#pointListView, this.#tripEventsContainer);
    //this.renderPoints();
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints() {
    this.#shownPoints.forEach((point) => this.#renderPoint(point));
  }

  #updatePoint(points, point) {
    points[points.findIndex((item) => item.id === point.id)] = point;
  }

  #sortPoints(id) {
    switch (id) {
      case SortingItems.DAY.id:
        // Если с сервера всегда будут загружаться данные, отсортированные по времени, то можно не сортировать и просто брать исходный массив
        // this.#shownPoints = [...this.#sourcedPoints];
        // , но об этом в ТЗ ни чего не сказано, и поэтому сортируем всегда
        this.#shownPoints.sort((pointA, pointB) =>
          dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)),
        );
        break;
      case SortingItems.TIME.id:
        this.#shownPoints.sort(
          (pointA, pointB) =>
            dayjs(pointB.dateTo) -
            dayjs(pointB.dateFrom) -
            (dayjs(pointA.dateTo) - dayjs(pointA.dateFrom)),
        );
        break;
      case SortingItems.PRICE.id:
        this.#shownPoints.sort(
          (pointA, pointB) =>
            pointB.price +
            pointB.offersCost -
            (pointA.price + pointA.offersCost),
        );
        break;
      default:
        throw new Error(
          `Передан неизвестный тип сортировки (id = ${id})! ${SortingItems.PRICE.id} ${SortingItems.PRICE.id === id}`,
        );
    }
    //this.#currentSortType = sortType;
  }

  #renderSorting() {
    this.#sortingView = new SortingView({
      items: SortingItems,
      onSortingChange: this.#handleSortingChange,
    });

    render(
      this.#sortingView,
      this.#tripEventsContainer,
      RenderPosition.AFTERBEGIN,
    );
    this.#sortingView.setActiveItem = INIT_SORT_ITEM.id;
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#pointListView.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      eventTypeList: EventTypes,
      destinationList: this.#destinationList,
      offerList: this.#offerList,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#updatePoint(this.#shownPoints, updatedPoint);
    this.#updatePoint(this.#sourcedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortingChange = (id) => {
    this.#sortPoints(id);
    this.refreshPoints();
  };
}
