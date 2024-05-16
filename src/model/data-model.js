import {
  destinationItems,
  eventTypeItems,
  eventTypeOffers,
  getRandomPoints,
  offerItems,
} from '../mock/mock-data.js';

const filterItems = ['Everything', 'Future', 'Present', 'Past'];
const sortItems = ['Day', 'Event', 'Time', 'Price', 'Offers'];

export class EventTypeListModel {
  constructor() {
    this.eventTypeList = eventTypeItems;
  }

  getEventTypeList() {
    return this.eventTypeList;
  }
}
export class DestinationListModel {
  constructor() {
    this.destinationList = destinationItems;
  }

  getDestinationList() {
    return this.destinationList;
  }
}
export class OfferListModel {
  constructor() {
    this.offerList = offerItems;
    this.offerListEventType = eventTypeOffers;
  }

  getOfferList(eventType) {
    const offerEventType = this.offerListEventType.find(
      (offer) => offer.type === eventType,
    );
    if (offerEventType) {
      return this.offerList.filter((item) =>
        offerEventType.offers.includes(item.id),
      );
    }
  }
}

export class PointViewModel {
  constructor(point) {
    this.pointView = point;
    this.offerList = offerItems;
  }

  getOffers() {
    return this.offerList.filter((item) =>
      this.pointView.offers.includes(item.id),
    );
  }

  getPointView() {
    this.pointView.offers = this.getOffers();
    return this.pointView;
  }
}
export class PointListModel {
  constructor() {
    this.pointList = getRandomPoints();
  }

  getPointList() {
    return this.pointList;
  }

  getTripInfo() {
    return {
      points: Array.from(
        new Set(this.pointList.map((item) => item.destination)),
      ),
      dateFrom: this.pointList[0].dateFrom,
      dateTo: this.pointList[this.pointList.length - 1].dateTo,
      cost: this.pointList.reduce(
        (cost, item) =>
          cost +
          item.price +
          new PointViewModel(item)
            .getOffers()
            .reduce((sum, offer) => sum + offer.price, 0),
        0,
      ),
    };
  }
}

export { filterItems, sortItems };
