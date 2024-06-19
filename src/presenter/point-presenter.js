import { remove, render, replace } from '@framework/render.js';
import { isEscapeKey } from '@utils/keyboard.js';
import { isDatesEqual } from '@utils/datetime.js';
import PointView from '@view/point-view.js';
import PointEditView from '@view/point-edit-view.js';
import { ActionType, FormMode, SortingItems, UpdateType } from '@src/const.js';

export default class PointPresenter {
  #container = null;
  #pointView = null;
  #pointEdit = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #eventTypeListModel = null;
  #destinationListModel = null;
  #offerListModel = null;

  #point = null;
  #mode = FormMode.VIEWING;
  #currentSorting = null;

  constructor({
    container,
    eventTypeListModel,
    destinationListModel,
    offerListModel,
    currentSorting,
    onDataChange,
    onModeChange,
  }) {
    this.#container = container;
    this.#eventTypeListModel = eventTypeListModel;
    this.#destinationListModel = destinationListModel;
    this.#offerListModel = offerListModel;
    this.#currentSorting = currentSorting;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointView = this.#pointView;
    const prevPointEdit = this.#pointEdit;

    this.#pointView = new PointView({
      point: this.#point,
      pointInfo: this.#getPointInfo(point),
      onBtnRollupClick: this.#handleBtnRollupClick,
      onBtnFavoriteClick: this.#handleBtnFavoriteClick,
    });

    this.#pointEdit = new PointEditView({
      point: this.#point,
      eventTypeList: this.#eventTypeListModel.items,
      destinationList: this.#destinationListModel.items,
      offerList: this.#offerListModel.items,
      onFormSubmit: this.#handleFormSubmit,
      onBtnDeleteClick: this.#handleBtnDeleteClick,
      onBtnRollupClick: this.#handleBtnRollupClick,
      formMode: FormMode.EDITING,
    });

    if (prevPointView === null || prevPointEdit === null) {
      render(this.#pointView, this.#container);
      return;
    }

    if (this.#mode === FormMode.VIEWING) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode !== FormMode.VIEWING) {
      replace(this.#pointEdit, prevPointEdit);
    }

    remove(prevPointView);
    remove(prevPointEdit);
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#pointEdit);
  }

  resetView() {
    if (this.#mode !== FormMode.VIEWING) {
      this.#pointEdit.reset(this.#point);
      this.#toView();
    }
  }

  #getPointInfo(point) {
    const desitation = this.#destinationListModel.getItemById(
      point.destination,
    );
    return {
      eventTypeName: this.#eventTypeListModel.getItemById(point.type).name,
      destinationName: desitation ? desitation.name : '',
      offers: point.offers.map((id) => ({
        title: this.#offerListModel.items[point.type][id].title,
        price: this.#offerListModel.items[point.type][id].price,
      })),
    };
  }

  #toEdit() {
    this.#handleModeChange();
    replace(this.#pointEdit, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = FormMode.EDITING;
  }

  #toView() {
    replace(this.#pointView, this.#pointEdit);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = FormMode.VIEWING;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#toView();
    }
  };

  #handleBtnFavoriteClick = () => {
    this.#handleDataChange(ActionType.UPDATE, UpdateType.PATCH, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #handleBtnRollupClick = () => {
    if (this.#mode === FormMode.VIEWING) {
      this.#toEdit();
    } else {
      this.resetView();
    }
  };

  #handleFormSubmit = (point) => {
    let updateType;
    // Поля влияют на фильтрацию, сделать бы MAJOR, но тогда сменится сортировки при переключении фильтров
    if (
      !isDatesEqual(this.#point.dateFrom, point.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, point.dateTo)
    )
      updateType = UpdateType.MINOR;
    // Поля влияют на сортировку
    else if (
      this.#point.price !== point.price &&
      this.#currentSorting === SortingItems.PRICE.id
    )
      updateType = UpdateType.MINOR;
    // Изменения повлият на сводную иформацию о маршруте
    else if (
      this.#point.destination !== point.destination ||
      this.#point.price !== point.price ||
      this.#offerListModel.getOffersCost(
        this.#point.offers,
        this.#point.type,
      ) !== this.#offerListModel.getOffersCost(point.offers, point.type)
    )
      updateType = UpdateType.SMALL;
    // Изменения влияют только на одну строку в списке
    else updateType = UpdateType.PATCH;
    this.#handleDataChange(ActionType.UPDATE, updateType, point);
    this.#toView();
  };

  #handleBtnDeleteClick = (point) => {
    this.#handleDataChange(ActionType.DELETE, UpdateType.MINOR, point);
  };
}
