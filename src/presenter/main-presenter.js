import { INIT_FILTER_ITEM } from '@src/const.js';
import { remove, render, RenderPosition } from '@framework/render.js';
import EventTypeListModel from '@model/event-type-list-model.js';
import DestinationListModel from '@model/destination-list-model.js';
import OfferListModel from '@model/offer-list-model.js';
import PointListModel from '@model/point-list-model.js';
import TripInfoView from '@view/trip-info-view.js';
import MessageView from '@view/message-view.js';
import FilterPresenter from '@presenter/filter-presenter.js';
import PointListPresenter from '@presenter/point-list-presenter.js';

export default class MainPresenter {
  #mainContainer = null;
  #filtersContainer = null;
  #tripEventsContainer = null;

  #filterPresenter = null;
  #pointListPresenter = null;

  #messageElement = null;

  #eventTypeList = null;
  #destinationList = null;
  #offerList = null;
  #pointList = null;

  constructor({ mainContainer, filtersContainer, tripEventsContainer }) {
    this.#mainContainer = mainContainer;
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;

    this.#eventTypeList = new EventTypeListModel();
    this.#destinationList = new DestinationListModel();
    this.#offerList = new OfferListModel();
    this.#pointList = new PointListModel(
      this.#eventTypeList,
      this.#destinationList,
      this.#offerList,
    );
  }

  // Инициализация презентера
  init() {
    this.#renderFiltres();
    if (this.#pointList.points.length > 0) {
      this.#renderTripInfo();
      this.#renderPointList();
    }
    this.#filterPresenter.setFilter(INIT_FILTER_ITEM.id);
  }

  // Рендеринг информации о поезке
  #renderTripInfo() {
    render(
      new TripInfoView(this.#pointList.getTripInfo()),
      this.#mainContainer,
      RenderPosition.AFTERBEGIN,
    );
  }

  // Рендеринг фильтров
  #renderFiltres() {
    this.#filterPresenter = new FilterPresenter({
      points: this.#pointList.points,
      container: this.#filtersContainer,
      onRefresh: this.#refreshPoints,
      onEmptyFilter: this.showMessage,
    });
    this.#filterPresenter.init();
  }

  // Рендеринг области для вывода списка точек маршрута
  #renderPointList() {
    this.#pointListPresenter = new PointListPresenter({
      tripEventsContainer: this.#tripEventsContainer,
      pointList: this.#pointList,
      eventTypeList: this.#eventTypeList,
      destinationList: this.#destinationList,
      offerList: this.#offerList,
    });
    this.#pointListPresenter.init();
  }

  // Обновление списка точек маршрута
  #refreshPoints = (points) => {
    this.#pointListPresenter.refreshPoints(points);
  };

  // Вывод сообщения
  showMessage = (message) => {
    if (this.#messageElement) {
      remove(this.#messageElement);
    }
    if (message) {
      this.#messageElement = new MessageView(message);
      render(this.#messageElement, this.#tripEventsContainer);
    }
  };
}
