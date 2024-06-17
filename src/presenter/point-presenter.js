import { remove, render, replace } from '@framework/render.js';
import { isEscapeKey } from '@utils/keyboard.js';
import PointView from '@view/point-view.js';
import PointEditView from '@view/point-edit-view.js';
import { ActionType, UpdateType } from '@src/const.js';

const Mode = {
  VIEWING: 'VIEWING',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsContainer = null;
  #pointView = null;
  #pointEdit = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #eventTypeList = null;
  #destinationList = null;
  #offerList = null;

  #point = null;
  #mode = Mode.VIEWING;

  constructor({
    pointsContainer,
    eventTypeList,
    destinationList,
    offerList,
    onDataChange,
    onModeChange,
  }) {
    this.#pointsContainer = pointsContainer;
    this.#eventTypeList = eventTypeList;
    this.#destinationList = destinationList;
    this.#offerList = offerList;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointView = this.#pointView;
    const prevPointEdit = this.#pointEdit;

    this.#pointView = new PointView({
      point: this.#point,
      onBtnRollupClick: this.#handleBtnRollupClick,
      onBtnFavoriteClick: this.#handleBtnFavoriteClick,
    });

    this.#pointEdit = new PointEditView({
      point: this.#point,
      eventTypeList: this.#eventTypeList,
      destinationList: this.#destinationList,
      offerList: this.#offerList,
      onFormSubmit: this.#handleFormSubmit,
      onBtnRollupClick: this.#handleBtnRollupClick,
    });

    if (prevPointView === null || prevPointEdit === null) {
      render(this.#pointView, this.#pointsContainer);
      return;
    }

    if (this.#mode === Mode.VIEWING) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode === Mode.EDITING) {
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
    if (this.#mode !== Mode.VIEWING) {
      this.#pointEdit.reset(this.#point);
      this.#toView();
    }
  }

  #toEdit() {
    this.#handleModeChange();
    replace(this.#pointEdit, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #toView() {
    replace(this.#pointView, this.#pointEdit);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.VIEWING;
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
    if (this.#mode === Mode.VIEWING) {
      this.#toEdit();
    } else {
      this.resetView();
    }
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(ActionType.UPDATE, UpdateType.MINOR, point);
    this.#toView();
  };
}
