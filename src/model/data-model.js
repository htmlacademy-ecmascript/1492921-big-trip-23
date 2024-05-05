const filterItems = ['Everything', 'Future', 'Present', 'Past'];
const sortItems = ['Day', 'Event', 'Time', 'Price', 'Offers'];
const eventTypeItems = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const destinationItems = [
  {name: 'Amsterdam', description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.'},
  {name: 'Geneva', description: ''},
  {name: 'Chamonix', description: 'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it\'s renowned for its skiing.'}
];
const offerItems = [
  {code: 'luggage', name: 'Add luggage', price: 50},
  {code: 'comfort', name: 'Switch to comfort', price: 80},
  {code: 'meal', name: 'Add meal', price: 15},
  {code: 'seats', name: 'Choose seats', price: 5},
  {code: 'train', name: 'Travel by train', price: 40}
];

const pointItems = [
  {eventType: 'Taxi', destination: 'Amsterdam', timeStart: '2019-03-18T10:30', timeEnd: '2019-03-18T11:00', price: 20, offers: [{name: 'Order Uber', price:20}], favorite: true},
  {eventType: 'Drive', destination: 'Chamonix', timeStart: '2019-03-18T14:30', timeEnd: '2019-03-18T16:05', price: 160, offers: [{name: 'Rent a car', price:200}], favorite: true},
  {eventType: 'Flight', destination: 'Geneva', timeStart: '2019-03-19T18:00', timeEnd: '2019-03-19T19:00', price: 20, offers: [{name: 'Add luggage', price:30}, {name: 'Switch to comfort', price:100}], favorite: false},
  {eventType: 'Sightseeing', destination: 'Geneva', timeStart: '2019-03-20T11:15', timeEnd: '2019-03-20T12:15', price: 180, offers: [], favorite: false}
];

const getTripInfo = () => ({
  points: Array.from(new Set(pointItems.map((item) => item.destination))),
  dateTimeStart: pointItems[0].timeStart,
  dateTimeEnd: pointItems[pointItems.length - 1].timeEnd,
  cost: pointItems.reduce((cost, item) => cost + item.price + item.offers.reduce((sum, offer) => sum + offer.price, 0), 0)
});

export {pointItems, filterItems, sortItems, eventTypeItems, destinationItems, offerItems};
export {getTripInfo};
