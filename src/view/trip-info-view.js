import {createElement} from '../render.js';
import {getDayString, getMonthString} from '@utils/datetime.js';

const tripInfoTemplate = ({trip, period, cost}) => `
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
  constructor({points, dateTimeStart, dateTimeEnd, cost}) {
    const startMonth = getMonthString(dateTimeStart);
    const startDay = getDayString(dateTimeStart);
    const endMonth = getMonthString(dateTimeEnd);
    const endDay = getDayString(dateTimeEnd);
    this.tripInfo = {
      trip: points.join(' &mdash; '),
      period: `${startDay}${startMonth === endMonth ? '' : `&nbsp;${startMonth}`}&nbsp;&mdash;&nbsp;${endDay}&nbsp;${endMonth}`,
      cost: cost
    };
  }

  getTemplate() {
    return tripInfoTemplate(this.tripInfo);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
