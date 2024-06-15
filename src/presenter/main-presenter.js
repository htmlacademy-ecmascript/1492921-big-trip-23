import { INIT_FILTER_ITEM } from '@src/const.js';
import { remove, render, RenderPosition } from '@framework/render.js';
import {
  DestinationListModel,
  OfferListModel,
  PointListModel,
} from '@model/data-model.js';
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

  #destinationListModel = null;
  #offerListModel = null;
  #pointListModel = null;

  constructor({ mainContainer, filtersContainer, tripEventsContainer }) {
    this.#mainContainer = mainContainer;
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;

    this.#destinationListModel = new DestinationListModel();
    this.#offerListModel = new OfferListModel();
    this.#pointListModel = new PointListModel(
      this.#destinationListModel.items,
      this.#offerListModel.items,
    );
  }

  // Инициализация презентера
  init() {
    this.#renderFiltres();
    if (this.#pointListModel.pointList.length > 0) {
      this.#renderTripInfo();
      this.#renderPointList();
    }
    this.#filterPresenter.setFilter(INIT_FILTER_ITEM.id);
  }

  // Рендеринг информации о поезке
  #renderTripInfo() {
    render(
      new TripInfoView(this.#pointListModel.tripInfo),
      this.#mainContainer,
      RenderPosition.AFTERBEGIN,
    );
  }

  // Рендеринг фильтров
  #renderFiltres() {
    this.#filterPresenter = new FilterPresenter({
      points: this.#pointListModel.pointList,
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
      pointsModel: this.#pointListModel,
      destinationListModel: this.#destinationListModel,
      offerListModel: this.#offerListModel,
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
