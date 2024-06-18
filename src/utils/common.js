const getItem = (items, keyValue, keyName = 'id') => {
  if (items && Array.isArray(items)) {
    return items.find((element) => element[keyName] === keyValue);
  }
  if (items && typeof items === 'object') {
    return items[keyValue];
  }
  return null;
};

const converArrayToObject = (source, keyName = 'id') => {
  const target = {};
  source.forEach((element) => {
    target[element[keyName]] = element;
  });
  return target;
};

const converArrayToMap = (source, keyName = 'id') => {
  const target = new Map();
  source.forEach((element) => {
    target.set(element[keyName], element);
  });
  return target;
};

export { converArrayToMap, converArrayToObject, getItem };
