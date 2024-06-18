import { randomPoints } from '../mock/mock-data.js';
import Observable from '@framework/observable.js';
import dayjs from 'dayjs';
import { ActionType, DEFAULT_SORTING, SortingItems } from '@src/const.js';

const SortingFunction = {
  [SortingItems.DAY.id]: (pointA, pointB) =>
    dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)),
  [SortingItems.TIME.id]: (pointA, pointB) =>
    dayjs(pointB.dateTo) -
    dayjs(pointB.dateFrom) -
    (dayjs(pointA.dateTo) - dayjs(pointA.dateFrom)),
  [SortingItems.PRICE.id]: (pointA, pointB) => pointB.price - pointA.price,
};
export default class PointListModel extends Observable {
  #points = randomPoints;
  #items = new Map();
  #destinationList = null;
  #offerList = null;

  constructor(destinationList, offerList) {
    super();
    this.#destinationList = destinationList;
    this.#offerList = offerList;
    this.#points.forEach((element) => {
      this.#items.set(element.id, element);
    });
  }

  get items() {
    return this.#items;
  }

  get points() {
    if (this.#items) {
      return Array.from(this.#items.values());
    }
    return null;
  }

  updateItems(actionType, updateType, point) {
    if (actionType === ActionType.DELETE) {
      this.#items.delete(point.id);
      this._notify(updateType);
      return;
    }
    this.#items.set(point.id, point);
    console.log('UPDATE');
    console.log(point);
    console.log(updateType);
    this._notify(updateType, point);
  }

  getTripInfo(points = this.points) {
    if (points.length === 0) {
      return null;
    }
    const pointsSortied = PointListModel.getSortedItems(
      points,
      SortingItems.DAY.id,
    );
    const destinationsDistinct = Array.from(
      new Set(
        pointsSortied.map(
          (item) => this.#destinationList.items[item.destination].name,
        ),
      ),
    );
    const lastDestionation =
      this.#destinationList.items[
        pointsSortied[pointsSortied.length - 1].destination
      ].name;
    if (
      destinationsDistinct[destinationsDistinct.length - 1] !== lastDestionation
    ) {
      destinationsDistinct.push(lastDestionation);
    }
    return {
      destinations: destinationsDistinct,
      dateFrom: pointsSortied[0].dateFrom,
      dateTo: pointsSortied[pointsSortied.length - 1].dateTo,
      cost: pointsSortied.reduce(
        (total, point) =>
          total +
          point.price +
          point.offers.reduce(
            (cost, offerId) =>
              cost + this.#offerList.items[point.type][offerId].price,
            0,
          ),
        0,
      ),
    };
  }

  static getSortedItems(items, sortId = DEFAULT_SORTING.id) {
    return items.sort(SortingFunction[sortId]);
  }
}
