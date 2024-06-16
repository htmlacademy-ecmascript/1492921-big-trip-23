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

export { converArrayToObject, getItem };
