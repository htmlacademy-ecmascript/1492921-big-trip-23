import { remove, render, RenderPosition } from '@framework/render.js';
import {
  AUTHORIZATION,
  END_POINT,
  HtmlClasses,
  MessageLoading,
  UpdateType,
} from '@src/const.js';

import EventTypeListModel from '@model/event-type-list-model.js';
import DestinationListModel from '@model/destination-list-model.js';
import OfferListModel from '@model/offer-list-model.js';
import PointListModel from '@model/point-list-model.js';
import FilterModel from '@model/filter-model.js';

import TripInfoView from '@view/trip-info-view.js';

import FilterPresenter from '@presenter/filter-presenter.js';
import PointListPresenter from '@presenter/point-list-presenter.js';

import TripApiService from '@src/trip-api-service.js';

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
  #btnNewEvent = null;

  constructor({ mainContainer, filtersContainer, tripEventsContainer }) {
    this.#mainContainer = mainContainer;
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;

    this.#btnNewEvent = mainContainer.querySelector(
      `.${HtmlClasses.INSERT_BUTTON}`,
    );
    this.#btnNewEvent.addEventListener('click', this.#btnNewEventClickHandler);
  }

  async init() {
    const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);
    this.#eventTypeListModel = new EventTypeListModel();
    this.#destinationListModel = new DestinationListModel(tripApiService);
    this.#offerListModel = new OfferListModel(tripApiService);
    this.#pointListModel = new PointListModel(
      tripApiService,
      this.#destinationListModel,
      this.#offerListModel,
    );
    this.#filterModel = new FilterModel();

    this.#pointListModel.addObserver(this.#handleModelEvent);
    this.#renderFiltres();
    this.#renderPointList();

    try {
      await this.#destinationListModel.init();
      await this.#offerListModel.init();
      await this.#pointListModel.init();
      this.#refreshTripInfo();
    } catch (err) {
      this.#btnNewEvent.disabled = true;
      this.#pointListPresenter.showMessage(MessageLoading.ERROR);
    }
  }

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

  #renderFiltres() {
    this.#filterPresenter = new FilterPresenter({
      container: this.#filtersContainer,
      filterModel: this.#filterModel,
      pointListModel: this.#pointListModel,
    });
    this.#filterPresenter.init();
  }

  #renderPointList() {
    this.#pointListPresenter = new PointListPresenter({
      container: this.#tripEventsContainer,
      pointListModel: this.#pointListModel,
      eventTypeListModel: this.#eventTypeListModel,
      destinationListModel: this.#destinationListModel,
      offerListModel: this.#offerListModel,
      filterModel: this.#filterModel,
      onNewPointDestroy: this.#handleNewPointFormClose,
    });
    this.#pointListPresenter.init();
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.PATCH) {
      return;
    }
    this.#refreshTripInfo();
  };

  #handleNewPointFormClose = () => {
    this.#btnNewEvent.disabled = false;
  };

  #btnNewEventClickHandler = () => {
    this.#pointListPresenter.insertPoint();
    this.#btnNewEvent.disabled = true;
  };
}
