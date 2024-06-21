import { convertArrayToObject } from '@utils/common.js';
export default class DestinationListModel {
  #tripApiService = null;
  #destinations = [];
  #items = {};

  constructor(tripApiService) {
    this.#tripApiService = tripApiService;
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

  async init() {
    try {
      this.#destinations = await this.#tripApiService.getDestinations();
    } catch (error) {
      throw new Error(error.message);
    }
    this.#items = convertArrayToObject(this.#destinations);
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
