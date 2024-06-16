import { randomPoints } from '../mock/mock-data.js';
import Observable from '@framework/observable.js';
import dayjs from 'dayjs';
import { INIT_SORT_ITEM, SortingItems } from '@src/const.js';

const SortingFunction = {
  [SortingItems.DAY.id]: (pointA, pointB) =>
    dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)),
  [SortingItems.TIME.id]: (pointA, pointB) =>
    dayjs(pointB.dateTo) -
    dayjs(pointB.dateFrom) -
    (dayjs(pointA.dateTo) - dayjs(pointA.dateFrom)),
  [SortingItems.PRICE.id]: (pointA, pointB) =>
    pointB.price + pointB.offersCost - (pointA.price + pointA.offersCost),
};

export default class PointListModel extends Observable {
  #points = randomPoints;
  #items = {};
  #eventTypeList = null;
  #destinationList = null;
  #offerList = null;

  constructor(eventTypeList, destinationList, offerList) {
    super();
    this.#eventTypeList = eventTypeList;
    this.#destinationList = destinationList;
    this.#offerList = offerList;
    this.#points.forEach((element) => {
      this.#items[element.id] = this.getItem(element);
    });
  }

  get items() {
    return this.#items;
  }

  get points() {
    if (this.#items) {
      return Object.values(this.#items);
    }
    return null;
  }

  getItem(point) {
    if (!point.id) {
      point.id = this.#points.length + 1;
    }
    point.eventTypeName = this.#eventTypeList.getItemById(point.type).name;
    point.destinationName = this.#destinationList.getItemById(
      point.destination,
    ).name;
    point.offersCost = 0;
    point.offers = point.offers.map((id) => {
      point.offersCost += this.#offerList.items[point.type][id].price;
      return this.#offerList.items[point.type][id];
    });
    return point;
  }

  getTripInfo(points = this.points) {
    if (points.length === 0) {
      return null;
    }
    const pointsSorting = this.#getSortingItems(points, SortingItems.DAY.id);
    const destinationsDistinct = Array.from(
      new Set(pointsSorting.map((item) => item.destinationName)),
    );
    if (
      destinationsDistinct[destinationsDistinct.length - 1] !==
      pointsSorting[pointsSorting.length - 1].destinationName
    ) {
      destinationsDistinct.push(
        pointsSorting[pointsSorting.length - 1].destinationName,
      );
    }
    return {
      destinations: destinationsDistinct,
      dateFrom: pointsSorting[0].dateFrom,
      dateTo: pointsSorting[pointsSorting.length - 1].dateTo,
      cost: pointsSorting.reduce(
        (cost, item) => cost + item.price + item.offersCost,
        0,
      ),
    };
  }

  #getSortingItems(items, sortId) {
    return items.sort(SortingFunction[sortId]);
  }
}
