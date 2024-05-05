import {render, RenderPosition} from '../render.js';
import {destinationItems, eventTypeItems, filterItems, offerItems, pointItems, sortItems} from '@model/data-model.js';
import {getTripInfo} from '@model/data-model.js';
import TripInfoView from '@view/trip-info-view.js';
import SortingView from '@view/sorting-view.js';
import PointView from '@view/point-view.js';
import EditPointsView from '@view/edit-point-view.js';
import FiltersView from '@view/filters-view.js';

const EDIT_POINT_INDEX = 1;

export default class MainPresenter {
  constructor() {
    this.tripMain = document.querySelector('.trip-main');
    this.tripFilters = this.tripMain.querySelector('.trip-controls__filters');
    this.tripPoints = document.createElement('ul');
    this.tripPoints.classList.add('trip-events__list');
    document.querySelector('.trip-events').append(this.tripPoints);
  }

  // Рендеринг информации о поезке
  renderTripInfo() {
    render(new TripInfoView(getTripInfo()), this.tripMain, RenderPosition.AFTERBEGIN);
  }

  // Рендеринг фильтров
  renderFiltres() {
    render(new FiltersView(filterItems), this.tripFilters);
  }

  // Рендеринг сортировки
  renderSorting() {
    render(new SortingView(sortItems), this.tripPoints, RenderPosition.AFTERBEGIN);
  }

  // Рендеринг формы редактирования данных о поездке
  renderEditPoint (item) {
    render(new EditPointsView(item, eventTypeItems, destinationItems, offerItems), this.tripPoints);
  }

  // Рендеринг событий поездки
  renderPoints() {
    pointItems.forEach((item, index) => {
      if (index === EDIT_POINT_INDEX) {
        this.renderEditPoint(item);
      } else {
        render(new PointView(item), this.tripPoints);
      }
    });
  }

  // Инициализация презентера
  init() {
    this.renderTripInfo();
    this.renderFiltres();
    this.renderSorting();
    this.renderPoints();
  }
}


