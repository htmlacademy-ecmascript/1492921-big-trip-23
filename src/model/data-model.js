import {
  mockDestinations,
  mockOffers,
  randomPoints,
} from '../mock/mock-data.js';
import { EventTypes } from '@src/const.js';

const getEventType = (type) => EventTypes[type.toUpperCase().replace('-', '_')];
export class DestinationListModel {
  #items = mockDestinations;

  get items() {
    return this.#items;
  }

  getItemByName(name) {
    return this.#items.find((element) => element.name === name);
  }

  getItemById(id) {
    return this.#items.find((element) => element.id === id);
  }
}
export class OfferListModel {
  #offers = mockOffers;
  #items = {};

  constructor() {
    this.#offers.forEach((element) => {
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
  #items = randomPoints;
  #tripInfo = {};

  constructor(destinationsModel, offersModel) {
    this.#items = this.#items.map((point) => {
      point.offers = point.offers.map(
        (item) => offersModel.items[point.type][item],
      );
      point.typeName = getEventType(point.type).name;
      point.destinationName = destinationsModel.getItemById(
        point.destination,
      ).name;
      point.offersCost = point.offers.reduce(
        (sum, offer) => sum + offer.price,
        0,
      );
      return point;
    });
  }

  get items() {
    return this.#items;
  }

  get tripInfo() {
    if (this.#items.length === 0) {
      return null;
    }
    return {
      points: Array.from(new Set(this.#items.map((item) => item.destination))),
      dateFrom: this.#items[0].dateFrom,
      dateTo: this.#items[this.#items.length - 1].dateTo,
      cost: this.#items.reduce(
        (cost, item) => cost + item.price + item.offersCost,
        0,
      ),
    };
  }
}

export { getEventType };
