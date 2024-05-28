import { DateTimeFormats } from '@src/const.js';
import { formatDateTime } from '@utils/datetime.js';
import AbstractView from '@framework/view/abstract-view.js';

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

export default class TripInfoView extends AbstractView {
  #tripInfo = null;

  constructor({ points, dateFrom, dateTo, cost }) {
    super();
    const dayMonthFom = formatDateTime(dateFrom, DateTimeFormats.DAY_MONTH);
    const dayMonthTo = formatDateTime(dateTo, DateTimeFormats.DAY_MONTH);
    const [startDay, startMonth] = dayMonthFom.split(' ');
    const [endDay, endMonth] = dayMonthTo.split(' ');
    const trip =
      points.length > 3
        ? `${points[0]} &mdash; ... &mdash; ${points[points.length - 1]}`
        : points.join(' &mdash; ');
    const period = `${startDay}${startMonth === endMonth ? '' : ` ${startMonth}`} &mdash; ${endDay} ${endMonth}`;
    this.#tripInfo = {
      trip,
      period,
      cost,
    };
  }

  get template() {
    return tripInfoTemplate(this.#tripInfo);
  }
}
