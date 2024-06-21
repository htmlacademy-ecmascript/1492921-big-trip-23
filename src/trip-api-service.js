import ApiService from '@framework/api-service';

const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const ApiRoute = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

export default class TripApiService extends ApiService {
  getPoints = async () =>
    ApiService.parseResponse(
      await this._load({ url: ApiRoute.POINTS, method: ApiMethod.GET }),
    );

  insertPoint = async (point) => {
    const response = await this._load({
      url: ApiRoute.POINTS,
      method: ApiMethod.POST,
      body: TripApiService.adaptToServer(point),
      headers: this.#getHeader(),
    });
    return TripApiService.adaptToClient(
      await ApiService.parseResponse(response),
    );
  };

  updatePoint = async (point) => {
    const response = await this._load({
      url: this.#getRoutePointId(point),
      method: ApiMethod.PUT,
      body: TripApiService.adaptToServer(point),
      headers: this.#getHeader(),
    });
    return TripApiService.adaptToClient(
      await ApiService.parseResponse(response),
    );
  };

  deletePoint = async (point) =>
    await this._load({
      url: this.#getRoutePointId(point),
      method: ApiMethod.DELETE,
    });

  getOffers = async () =>
    ApiService.parseResponse(
      await this._load({ url: ApiRoute.OFFERS, method: ApiMethod.GET }),
    );

  getDestinations = async () =>
    ApiService.parseResponse(
      await this._load({ url: ApiRoute.DESTINATIONS, method: ApiMethod.GET }),
    );

  #getRoutePointId = ({ id }) => `${ApiRoute.POINTS}/${id}`;
  #getHeader = () => new Headers({ 'Content-Type': 'application/json' });

  static adaptToServer = (point) =>
    JSON.stringify({
      ['id']: point.id,
      ['type']: point.type,
      ['destination']: point.destination,
      ['date_from']: point.dateFrom,
      ['date_to']: point.dateTo,
      ['base_price']: point.price,
      ['offers']: point.offers,
      ['is_favorite']: point.isFavorite,
    });

  static adaptToClient = (point) => ({
    id: point['id'],
    type: point['type'],
    destination: point['destination'],
    dateFrom: point['date_from'],
    dateTo: point['date_to'],
    price: point['base_price'],
    offers: point['offers'],
    isFavorite: point['is_favorite'],
  });
}
