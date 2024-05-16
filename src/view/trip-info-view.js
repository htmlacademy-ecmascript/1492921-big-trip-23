import { createElement } from '../render.js';
import { getDayString, getMonthString } from '@utils/datetime.js';

const tripInfoTemplate = ({ trip, period, cost }) => `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${trip}</h1>
      <p class="trip-info__dates">${period}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;

export default class TripInfoView {
  constructor({ points, dateFrom, dateTo, cost }) {
    const startMonth = getMonthString(dateFrom);
    const startDay = getDayString(dateFrom);
    const endMonth = getMonthString(dateTo);
    const endDay = getDayString(dateTo);
    this.tripInfo = {
      trip:
        points.length > 3
          ? `${points[0]}&mdash;...&mdash;${points[points.length - 1]}`
          : points.join('&mdash;'),
      period: `${startDay}${startMonth === endMonth ? '' : `&nbsp;${startMonth}`}&nbsp;&mdash;&nbsp;${endDay}&nbsp;${endMonth}`,
      cost: cost,
    };
  }

  getTemplate = () => tripInfoTemplate(this.tripInfo);

  getElement = () => {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  };

  removeElement = () => {
    this.element = null;
  };
}
