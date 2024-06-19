import { converArrayToObject } from '@utils/common.js';

export default class EventTypeListModel {
  #eventTypes = [
    { id: 'taxi', name: 'Taxi' },
    { id: 'bus', name: 'Bus' },
    { id: 'train', name: 'Train' },
    { id: 'ship', name: 'Ship' },
    { id: 'drive', name: 'Drive' },
    { id: 'flight', name: 'Flight' },
    { id: 'check-in', name: 'Check-in' },
    { id: 'sightseeing', name: 'Sightseeing' },
    { id: 'restaurant', name: 'Restaurant' },
  ];

  #items = {};

  constructor() {
    this.#items = converArrayToObject(this.#eventTypes);
  }

  get items() {
    return this.#items;
  }

  get eventTypes() {
    return this.#eventTypes;
  }

  getItemByName(name) {
    return Object.keys(this.#items).find((id) => this.#items[id].name === name);
  }

  getItemById(id) {
    return this.#items[id];
  }
}
