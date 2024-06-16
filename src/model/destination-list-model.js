import { mockDestinations } from '../mock/mock-data.js';
import { converArrayToObject } from '@utils/common.js';

export default class DestinationListModel {
  #destinations = mockDestinations;
  #items = {};

  constructor() {
    this.#items = converArrayToObject(this.#destinations);
  }

  get items() {
    return this.#items;
  }

  get destinations() {
    if (this.#items) {
      return Object.values(this.#items);
    }
    return [];
  }

  getItemByName(name) {
    if (this.#items) {
      return Object.values(this.#items).find((item) => item.name === name);
    }
    return null;
  }

  getItemById(id) {
    if (this.#items) {
      return this.#items[id];
    }
    return null;
  }
}
