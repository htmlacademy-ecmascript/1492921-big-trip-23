import { render, RenderPosition } from '../render.js';
import {
  DestinationListModel,
  EventTypeListModel,
  OfferListModel,
  PointListModel,
  PointViewModel,
} from '@model/data-model.js';
import { filterItems, sortItems } from '@model/data-model.js';
import TripInfoView from '@view/trip-info-view.js';
import SortingView from '@view/sorting-view.js';
import PointView from '@view/point-view.js';
import EditPointsView from '@view/edit-point-view.js';
import FiltersView from '@view/filters-view.js';

const destinationListModel = new DestinationListModel();
const eventTypeListModel = new EventTypeListModel();
const offerListModel = new OfferListModel();
const pointListModel = new PointListModel();

const EDIT_POINT_INDEX = 1;
const NEW_POINT_INDEX = 2;

export default class MainPresenter {
  constructor() {
    this.tripMain = document.querySelector('.trip-main');
    this.tripFilters = this.tripMain.querySelector('.trip-controls__filters');
    this.tripPoints = document.createElement('ul');
    this.tripPoints.classList.add('trip-events__list');
    document.querySelector('.trip-events').append(this.tripPoints);
  }

  // Рендеринг информации о поезке
  renderTripInfo = () => {
    render(
      new TripInfoView(pointListModel.getTripInfo()),
      this.tripMain,
      RenderPosition.AFTERBEGIN,
    );
  };

  // Рендеринг фильтров
  renderFiltres = () => {
    render(new FiltersView(filterItems), this.tripFilters);
  };

  // Рендеринг сортировки
  renderSorting = () => {
    render(
      new SortingView(sortItems),
      this.tripPoints,
      RenderPosition.AFTERBEGIN,
    );
  };

  // Рендеринг формы редактирования данных о поездке
  renderEditPoint = (item, isNew) => {
    render(
      new EditPointsView(
        item,
        eventTypeListModel.getEventTypeList(),
        destinationListModel.getDestinationList(),
        offerListModel.getOfferList(item.type),
        isNew,
      ),
      this.tripPoints,
    );
  };

  // Рендеринг событий поездки
  renderPoints = () => {
    pointListModel.getPointList().forEach((item, index) => {
      if (index === EDIT_POINT_INDEX) {
        this.renderEditPoint(item, false);
      } else if (index === NEW_POINT_INDEX) {
        this.renderEditPoint(item, true);
      } else {
        render(
          new PointView(new PointViewModel(item).getPointView()),
          this.tripPoints,
        );
      }
    });
  };

  // Инициализация презентера
  init = () => {
    this.renderTripInfo();
    this.renderFiltres();
    this.renderSorting();
    this.renderPoints();
  };
}
