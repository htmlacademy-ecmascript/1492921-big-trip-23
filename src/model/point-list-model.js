import Observable from '@framework/observable.js';
import dayjs from 'dayjs';
import {
  ActionType,
  DEFAULT_SORTING,
  SortingItems,
  UpdateType,
} from '@src/const.js';
import TripApiService from '@src/trip-api-service';

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
  #tripApiService = null;
  #points = [];
  #items = new Map();
  #destinationList = null;
  #offerList = null;

  constructor(tripApiService, destinationList, offerList) {
    super();
    this.#tripApiService = tripApiService;
    this.#destinationList = destinationList;
    this.#offerList = offerList;
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

  async init() {
    try {
      this.#points = (await this.#tripApiService.getPoints()).map(
        TripApiService.adaptToClient,
      );
    } catch (error) {
      throw new Error(error.message);
    }

    this.#points.forEach((element) => {
      this.#items.set(element.id, element);
    });
    this._notify(UpdateType.MAJOR);
  }

  async updateItems(actionType, updateType, point) {
    if (actionType === ActionType.DELETE) {
      try {
        await this.#tripApiService.deletePoint(point);
        this.#items.delete(point.id);
        this._notify(updateType, { ...point });
      } catch (error) {
        throw new Error(`Delete error: ${error.message}`);
      }
      return;
    }
    try {
      let savedPoint;
      if (actionType === ActionType.INSERT) {
        savedPoint = await this.#tripApiService.insertPoint(point);
      }
      if (actionType === ActionType.UPDATE) {
        savedPoint = await this.#tripApiService.updatePoint(point);
      }
      this.#items.set(savedPoint.id, savedPoint);
      this._notify(updateType, savedPoint);
    } catch (error) {
      throw new Error(`${actionType} error: ${error.message}`);
    }
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
          this.#offerList.getOffersCost(point.offers, point.type),
        0,
      ),
    };
  }

  static getSortedItems(items, sortId = DEFAULT_SORTING.id) {
    return items.sort(SortingFunction[sortId]);
  }
}
