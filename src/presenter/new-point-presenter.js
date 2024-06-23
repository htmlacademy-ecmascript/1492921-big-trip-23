import { remove, render, RenderPosition } from '@framework/render.js';
import PointEditView from '@view/point-edit-view.js';
import { isEscapeKey } from '@utils/keyboard.js';
import { ActionType, FormMode, UpdateType } from '@src/const.js';

export default class NewPointPresenter {
  #container = null;

  #pointEdit = null;

  #eventTypeListModel = null;
  #destinationListModel = null;
  #offerListModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({
    container,
    eventTypeListModel,
    destinationListModel,
    offerListModel,
    onDataChange,
    onDestroy,
  }) {
    this.#container = container;
    this.#eventTypeListModel = eventTypeListModel;
    this.#destinationListModel = destinationListModel;
    this.#offerListModel = offerListModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEdit !== null) {
      return;
    }

    this.#pointEdit = new PointEditView({
      eventTypeList: this.#eventTypeListModel.items,
      destinationList: this.#destinationListModel.items,
      offerList: this.#offerListModel.items,
      onFormSubmit: this.#handleFormSubmit,
      onBtnDeleteClick: this.#handleBtnDeleteClick,
      formMode: FormMode.INSERTING,
    });

    render(this.#pointEdit, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEdit === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEdit);
    this.#pointEdit = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = (isSaving = true) => this.#pointEdit.updateElement({ isSaving });
  setAborting = () => this.#pointEdit.shake(this.setSaving(false));

  #handleFormSubmit = (point) => {
    this.#handleDataChange(ActionType.INSERT, UpdateType.MAJOR, point);
  };

  #handleBtnDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
