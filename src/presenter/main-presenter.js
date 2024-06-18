import { remove, render, RenderPosition } from '@framework/render.js';
import { UpdateType } from '@src/const.js';

import EventTypeListModel from '@model/event-type-list-model.js';
import DestinationListModel from '@model/destination-list-model.js';
import OfferListModel from '@model/offer-list-model.js';
import PointListModel from '@model/point-list-model.js';
import FilterModel from '@model/filter-model.js';

import TripInfoView from '@view/trip-info-view.js';

import FilterPresenter from '@presenter/filter-presenter.js';
import PointListPresenter from '@presenter/point-list-presenter.js';

export default class MainPresenter {
  #mainContainer = null;
  #filtersContainer = null;
  #tripEventsContainer = null;

  #filterPresenter = null;
  #pointListPresenter = null;

  #eventTypeListModel = null;
  #destinationListModel = null;
  #offerListModel = null;
  #pointListModel = null;
  #filterModel = null;

  #tripInfoView = null;

  constructor({ mainContainer, filtersContainer, tripEventsContainer }) {
    this.#mainContainer = mainContainer;
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;

    this.#eventTypeListModel = new EventTypeListModel();
    this.#destinationListModel = new DestinationListModel();
    this.#offerListModel = new OfferListModel();
    this.#pointListModel = new PointListModel(
      this.#destinationListModel,
      this.#offerListModel,
    );
    this.#filterModel = new FilterModel();

    this.#pointListModel.addObserver(this.#handleModelEvent);
  }

  // Инициализация презентера
  init() {
    this.#renderFiltres();
    this.#renderPointList();
    this.#refreshTripInfo();
  }

  // Отображение информации о поезке
  #refreshTripInfo() {
    remove(this.#tripInfoView);
    if (this.#pointListModel.points.length > 0) {
      this.#tripInfoView = new TripInfoView(this.#pointListModel.getTripInfo());
      render(
        this.#tripInfoView,
        this.#mainContainer,
        RenderPosition.AFTERBEGIN,
      );
    }
  }

  // Рендеринг фильтров
  #renderFiltres() {
    this.#filterPresenter = new FilterPresenter({
      container: this.#filtersContainer,
      filterModel: this.#filterModel,
      pointListModel: this.#pointListModel,
    });
    this.#filterPresenter.init();
  }

  // Рендеринг области для вывода списка точек маршрута
  #renderPointList() {
    this.#pointListPresenter = new PointListPresenter({
      container: this.#tripEventsContainer,
      pointListModel: this.#pointListModel,
      eventTypeListModel: this.#eventTypeListModel,
      destinationListModel: this.#destinationListModel,
      offerListModel: this.#offerListModel,
      filterModel: this.#filterModel,
    });
    this.#pointListPresenter.init();
  }

  #handleModelEvent = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      return;
    }
    this.#refreshTripInfo();
  };
}
