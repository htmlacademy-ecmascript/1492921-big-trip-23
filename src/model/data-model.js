import {
  mockDestinations,
  mockOffers,
  randomPoints,
} from '../mock/mock-data.js';

const FilterItems = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
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

const EventTypes = {
  TAXI: 'Taxi',
  BUS: 'Bus',
  TRAIN: 'Train',
  SHIP: 'Ship',
  DRIVe: 'Drive',
  FLIGHT: 'Flight',
  CHECK_IN: 'Check-in',
  SIGHTSEEING: 'Sightseeing',
  RESTAURANT: 'Restaurant',
};

export class DestinationListModel {
  #items = mockDestinations;

  get items() {
    return this.#items;
  }
}
export class OfferListModel {
  #items = {};

  constructor() {
    mockOffers.forEach((element) => {
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

  constructor(offerList) {
    this.#pointList = randomPoints.map((point) => {
      point.offers = point.offers.map((item) => offerList[point.type][item]);
      point.offersCost = point.offers.reduce(
        (sum, offer) => sum + offer.price,
        0,
      );
      return point;
    });
  }

  get pointList() {
    return this.#pointList;
  }

  get tripInfo() {
    if (this.#pointList.length === 0) {
      return null;
    }
    return {
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
}

export { FilterItems, SortItems, EventTypes };
