import { UpdateType } from '../const';
export default class OfferListModel {
  #tripApiService = null;
  #offers = [];
  #items = {};

  constructor(tripApiService) {
    this.#tripApiService = tripApiService;
  }

  get items() {
    return this.#items;
  }

  async init() {
    try {
      this.#offers = await this.#tripApiService.getOffers();
    } catch (err) {
      throw new Error(err.message);
    }

    this.#offers.forEach((element) => {
      const offers = {};
      element.offers.forEach((offer) => {
        offers[offer.id] = offer;
      });
      this.#items[element.type] = offers;
    });
  }

  getOffersForEventType = (eventType) => {
    if (this.#items && this.#items[eventType]) {
      return Object.values(this.#items[eventType]);
    }
    return [];
  };

  getOffersCost = (offers, type) => {
    const offersType = this.#items[type];
    if (!offersType) {
      return 0;
    }
    return offers.reduce(
      (cost, offerId) => cost + offersType[offerId].price,
      0,
    );
  };
}
