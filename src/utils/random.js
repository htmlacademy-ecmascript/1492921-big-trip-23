const getRandomInt = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

const getRandomArrayElement = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomArrayElements = (arr, count) =>
  arr.sort(() => 0.5 - Math.random()).slice(0, count);

export { getRandomInt, getRandomArrayElement, getRandomArrayElements };
