import MainPresenter from '@presenter/main-presenter.js';

const mainElement = document.querySelector('.trip-main');
const filtersElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const mainPresenter = new MainPresenter({
  mainContainer: mainElement,
  filtersContainer: filtersElement,
  tripEventsContainer: tripEventsElement,
});

mainPresenter.init();
