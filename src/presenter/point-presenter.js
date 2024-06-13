import { remove, render, replace } from '@framework/render.js';
import { isEscapeKey } from '@utils/keyboard.js';
import PointView from '@view/point-view.js';
import PointEditView from '@view/point-edit-view.js';

const Mode = {
  VIEWING: 'VIEWING',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
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
    pointListContainer,
    onDataChange,
    onModeChange,
    eventTypeList,
    destinationList,
    offerList,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#eventTypeList = eventTypeList;
    this.#destinationList = destinationList;
    this.#offerList = offerList;
  }

  init(point) {
    this.#point = point;

    const prevPointView = this.#pointView;
    const prevPointEdit = this.#pointEdit;

    this.#pointView = new PointView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEdit = new PointEditView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick,
      eventTypeList: this.#eventTypeList,
      destinationList: this.#destinationList,
      offerList: this.#offerList,
    });

    if (prevPointView === null || prevPointEdit === null) {
      render(this.#pointView, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
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
      this.#toView();
    }
  }

  #toEdit() {
    replace(this.#pointEdit, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #toView() {
    replace(this.#pointView, this.#pointEdit);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    // В учебном проекте этого нет
    this.#handleModeChange();
    // -----
    this.#mode = Mode.VIEWING;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#toView();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #handleEditClick = () => {
    this.#toEdit();
  };

  #handleCloseClick = () => {
    this.#toView();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#toView();
  };
}
