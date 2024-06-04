import {
  eventTypes,
  mokeDestinations,
  mokeOffers,
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
  #items = eventTypes;

  get items() {
    return this.#items;
  }
}
export class DestinationListModel {
  #items = mokeDestinations;

  get items() {
    return this.#items;
  }
}
export class OfferListModel {
  #items = {};

  constructor() {
    mokeOffers.forEach((element) => {
      const offers = {};
      element.offers.forEach((offer) => {
        offers[offer.id] = offer;
      });
      this.#items[element.type] = offers;
    });
  }

  get items() {
    return this.#items;
  }
}

export class PointListModel {
  #pointList = null;
  #tripInfo = {};

  constructor(offerList) {
    this.#pointList = randomPoints.map((point) => {
      point.offers = point.offers.map((item) => offerList[point.type][item]);
      point.offersCost = point.offers.reduce(
        (sum, offer) => sum + offer.price,
        0,
      );
      return point;
    });

    this.#tripInfo = {
      points: Array.from(
        new Set(this.#pointList.map((item) => item.destination)),
      ),
      dateFrom: this.#pointList[0].dateFrom,
      dateTo: this.#pointList[this.#pointList.length - 1].dateTo,
      cost: this.#pointList.reduce(
        (cost, item) => cost + item.price + item.offersCost,
        0,
      ),
    };
  }

  get pointList() {
    return this.#pointList;
  }

  get tripInfo() {
    return this.#tripInfo;
  }
}

export { FilterItems, SortItems };
