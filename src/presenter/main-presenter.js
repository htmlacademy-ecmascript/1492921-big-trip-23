import { BLANK_POINT, Messages } from '@src/const.js';
import { remove, render, RenderPosition, replace } from '@framework/render.js';
import {
  DestinationListModel,
  OfferListModel,
  PointListModel,
} from '@model/data-model.js';
import { EventTypes, FilterItems, SortItems } from '@model/data-model.js';
import TripInfoView from '@view/trip-info-view.js';
import SortingView from '@view/sorting-view.js';
import PointView from '@view/point-view.js';
import EditPointsView from '@view/edit-point-view.js';
import FiltersView from '@view/filters-view.js';
import PointListView from '@view/point-list-view.js';
import MessageView from '@view/message-view.js';

const destinationListModel = new DestinationListModel();
const offerListModel = new OfferListModel();
const pointListModel = new PointListModel(offerListModel.items);

export default class MainPresenter {
  #mainContainer = null;
  #filtersContainer = null;
  #pointsContainer = null;
  #pointList = null;
  #messageElement = null;

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
  #renderPoints() {
    pointListModel.pointList.forEach((item) => {
      this.#renderPoint(item);
    });
  }

  // Вывод сообщения
  #showMessage(message) {
    if (this.#messageElement) {
      remove(this.#messageElement);
    }
    if (message) {
      this.#messageElement = new MessageView(message);
      render(this.#messageElement, this.#pointsContainer);
    }
  }

  // Инициализация презентера
  init() {
    this.#renderFiltres();
    if (pointListModel.pointList.length === 0) {
      this.#showMessage(Messages.EVERYTHING);
    } else {
      this.#renderTripInfo();
      this.renderSorting();
      this.#renderPointList();
      this.#renderPoints();
    }
  }
}
