import MainPresenter from './presenter/main-presenter.js';

const mainElement = document.querySelector('.trip-main');
const filtersElement = mainElement.querySelector('.trip-controls__filters');
const pointsElement = document.querySelector('.trip-events');

const mainPresenter = new MainPresenter({
  mainContainer: mainElement,
  filtersContainer: filtersElement,
  pointsContainer: pointsElement,
});

mainPresenter.init();
