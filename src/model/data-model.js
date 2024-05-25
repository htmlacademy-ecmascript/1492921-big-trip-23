import {
  destinationItems,
  eventTypeItems,
  eventTypeOffers,
  offerItems,
  randomPoints,
} from '../mock/mock-data.js';

const FilterItems = {
  EVERYTHING: 'Everything',
  FIGURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past',
};
const SortItems = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

export class EventTypeListModel {
  #eventTypeList = eventTypeItems;

  get eventTypeList() {
    return this.#eventTypeList;
  }
}
export class DestinationListModel {
  #destinationList = destinationItems;

  get destinationList() {
    return this.#destinationList;
  }
}
export class OfferListModel {
  #offerList = offerItems;
  #offerListEventType = eventTypeOffers;

  get offerList() {
    return this.#offerList;
  }

  getOfferList(eventType) {
    const offerEventType = this.#offerListEventType.find(
      (offer) => offer.type === eventType,
    );
    if (offerEventType) {
      return this.#offerList.filter((item) =>
        offerEventType.offers.includes(item.id),
      );
    }
  }
}

export class PointViewModel {
  #pointView = null;
  #offerList = offerItems;

  constructor(point) {
    this.#pointView = point;
    this.#pointView.offersCost = 0;
  }

  #getOffers() {
    return this.#offerList.filter((item) =>
      this.#pointView.offers.includes(item.id),
    );
  }

  get pointView() {
    this.#pointView.offers = this.#getOffers();
    this.#pointView.offersCost = this.#pointView.offers.reduce(
      (sum, offer) => sum + offer.price,
      0,
    );
    return this.#pointView;
  }
}
export class PointListModel {
  #pointList = randomPoints;

  get pointList() {
    return this.#pointList;
  }

  getTripInfo() {
    return {
      points: Array.from(
        new Set(this.#pointList.map((item) => item.destination)),
      ),
      dateFrom: this.#pointList[0].dateFrom,
      dateTo: this.#pointList[this.#pointList.length - 1].dateTo,
      cost: this.#pointList.reduce(
        (cost, item) => cost + item.price + new PointViewModel(item).offersCost,
        0,
      ),
    };
  }
}

export { FilterItems, SortItems };
