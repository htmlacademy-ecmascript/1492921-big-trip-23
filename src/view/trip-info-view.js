import { DateTimeFormats, MAX_DESTINATION_IN_TRIP_INFO } from '@src/const.js';
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

  constructor({ destinations, dateFrom, dateTo, cost }) {
    super();
    const dayMonthFrom = formatDateTime(dateFrom, DateTimeFormats.DAY_MONTH);
    const dayMonthTo = formatDateTime(dateTo, DateTimeFormats.DAY_MONTH);
    const [startDay, startMonth] = dayMonthFrom.split(' ');
    const [endDay, endMonth] = dayMonthTo.split(' ');
    const trip =
      destinations.length > MAX_DESTINATION_IN_TRIP_INFO
        ? `${destinations[0]} &mdash; &hellip; &mdash; ${destinations[destinations.length - 1]}`
        : destinations.join(' &mdash; ');
    let period = dayMonthFrom;
    if (dayMonthFrom !== dayMonthTo) {
      period = `${startDay}${startMonth === endMonth ? '' : ` ${startMonth}`} &mdash; ${endDay} ${endMonth}`;
    }
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
