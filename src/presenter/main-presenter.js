import { BLANK_POINT, EDIT_POINT_INDEX } from '@src/const.js';
import { render, RenderPosition } from '@framework/render.js';
import {
  DestinationListModel,
  EventTypeListModel,
  OfferListModel,
  PointListModel,
} from '@model/data-model.js';
import { FilterItems, SortItems } from '@model/data-model.js';
import TripInfoView from '@view/trip-info-view.js';
import SortingView from '@view/sorting-view.js';
import PointView from '@view/point-view.js';
import EditPointsView from '@view/edit-point-view.js';
import FiltersView from '@view/filters-view.js';
import PointListView from '@view/point-list-view.js';

const destinationListModel = new DestinationListModel();
const eventTypeListModel = new EventTypeListModel();
const offerListModel = new OfferListModel();
const pointListModel = new PointListModel(offerListModel.items);

export default class MainPresenter {
  #mainContainer = null;
  #filtersContainer = null;
  #pointsContainer = null;
  #pointList = null;

  constructor({ mainContainer, filtersContainer, pointsContainer }) {
    this.#mainContainer = mainContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsContainer = pointsContainer;
    this.#pointList = new PointListView();
  }

  // Рендеринг информации о поезке
  #renderTripInfo() {
    render(
      new TripInfoView(pointListModel.tripInfo),
      this.#mainContainer,
      RenderPosition.AFTERBEGIN,
    );
  }

  // Рендеринг фильтров
  #renderFiltres() {
    render(new FiltersView(FilterItems), this.#filtersContainer);
  }

  // Рендеринг сортировки
  renderSorting() {
    render(
      new SortingView(SortItems),
      this.#pointsContainer,
      RenderPosition.AFTERBEGIN,
    );
  }

  // Рендеринг контейнера для событий поездки
  #renderPointList() {
    render(this.#pointList, this.#pointsContainer);
  }

  // Рендеринг формы редактирования данных о поездке
  renderEditPoint(item) {
    render(
      new EditPointsView(
        item,
        eventTypeListModel.items,
        destinationListModel.items,
        offerListModel.items[item ? item.type : BLANK_POINT.type],
      ),
      this.#pointList.element,
    );
  }

  #renderPoint(point) {
    const pointView = new PointView(point);

    render(pointView, this.#pointList.element);
  }

  // Рендеринг событий поездки
  renderPoints() {
    // отрисовка формы добавления поездки
    this.renderEditPoint();
    pointListModel.pointList.forEach((item, index) => {
      if (index === EDIT_POINT_INDEX) {
        // отрисовка формы редактирования поездки
        this.renderEditPoint(item);
      } else {
        this.#renderPoint(item);
      }
    });
  }

  // Инициализация презентера
  init() {
    this.#renderTripInfo();
    this.#renderFiltres();
    this.renderSorting();
    this.#renderPointList();
    this.renderPoints();
  }
}
