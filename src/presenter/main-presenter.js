import { BLANK_POINT, INIT_FILTER_ITEM } from '@src/const.js';
import { remove, render, RenderPosition, replace } from '@framework/render.js';
import {
  DestinationListModel,
  OfferListModel,
  PointListModel,
} from '@model/data-model.js';
import { EventTypes, SortItems } from '@model/data-model.js';
import TripInfoView from '@view/trip-info-view.js';
import SortingView from '@view/sorting-view.js';
import PointView from '@view/point-view.js';
import EditPointsView from '@view/edit-point-view.js';
import PointListView from '@view/point-list-view.js';
import MessageView from '@view/message-view.js';

import FilterPresenter from '@presenter/filter-presenter.js';

const destinationListModel = new DestinationListModel();
const offerListModel = new OfferListModel();
const pointListModel = new PointListModel(offerListModel.items);

export default class MainPresenter {
  #mainContainer = null;
  #filtersContainer = null;
  #pointsContainer = null;
  #pointList = null;
  #messageElement = null;
  #filterComponent = null;

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

  // Создание фильтров
  #createFiltres() {
    this.#filterComponent = new FilterPresenter({
      points: pointListModel.pointList,
      onRefresh: (filterPoints) => this.#renderPoints(filterPoints),
      container: this.#filtersContainer,
      onEmptyFilter: (message) => this.#showMessage(message),
    });
    this.#filterComponent.init();
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
  /*
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
  */

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeForm();
      }
    };

    function closeForm() {
      toView();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    const pointView = new PointView({
      point,
      onEditClick: () => {
        toEdit();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });
    const pointEdit = new EditPointsView({
      point,
      onFormSubmit: () => {
        closeForm();
      },
      onCloseClick: () => {
        closeForm();
      },
      eventTypeList: EventTypes,
      destinationList: destinationListModel.items,
      offerList: offerListModel.items[point ? point.type : BLANK_POINT.type],
    });

    function toEdit() {
      replace(pointEdit, pointView);
    }

    function toView() {
      replace(pointView, pointEdit);
    }

    render(pointView, this.#pointList.element);
  }

  // Рендеринг событий поездки
  #renderPoints(points) {
    this.#showMessage();
    this.#pointList.clear();
    points.forEach((item) => {
      this.#renderPoint(item);
    });
  }

  // Вывод сообщения
  #showMessage(message) {
    if (this.#messageElement) {
      remove(this.#messageElement);
    }
    if (message) {
      this.#pointList.clear();
      this.#messageElement = new MessageView(message);
      render(this.#messageElement, this.#pointsContainer);
    }
  }

  // Инициализация презентера
  init() {
    this.#createFiltres();
    if (pointListModel.pointList.length > 0) {
      this.#renderTripInfo();
      this.renderSorting();
      this.#renderPointList();
    }
    this.#filterComponent.setFilter(INIT_FILTER_ITEM);
  }
}
