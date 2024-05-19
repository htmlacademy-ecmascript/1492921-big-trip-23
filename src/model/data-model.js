import {
  destinationItems,
  eventTypeItems,
  eventTypeOffers,
  offerItems,
  randomPoints,
} from '../mock/mock-data.js';

const FilterItems = {
  EVERYTHING: 'Everything',
  FIGURE: 'Future',
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

export class EventTypeListModel {
  constructor() {
    this.eventTypeList = eventTypeItems;
  }

  getEventTypeList = () => this.eventTypeList;
}
export class DestinationListModel {
  constructor() {
    this.destinationList = destinationItems;
  }

  getDestinationList = () => this.destinationList;
}
export class OfferListModel {
  constructor() {
    this.offerList = offerItems;
    this.offerListEventType = eventTypeOffers;
  }

  getOfferList = (eventType) => {
    const offerEventType = this.offerListEventType.find(
      (offer) => offer.type === eventType,
    );
    if (offerEventType) {
      return this.offerList.filter((item) =>
        offerEventType.offers.includes(item.id),
      );
    }
  };
}

export class PointViewModel {
  constructor(point) {
    this.pointView = point;
    this.offerList = offerItems;
  }

  getOffers = () =>
    this.offerList.filter((item) => this.pointView.offers.includes(item.id));

  getPointView = () => {
    this.pointView.offers = this.getOffers();
    return this.pointView;
  };
}
export class PointListModel {
  constructor() {
    this.pointList = randomPoints;
  }

  getPointList = () => this.pointList;

  getTripInfo = () => ({
    points: Array.from(new Set(this.pointList.map((item) => item.destination))),
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
  });
}

export { FilterItems, SortItems };
