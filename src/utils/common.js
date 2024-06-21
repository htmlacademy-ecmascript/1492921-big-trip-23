const getItem = (items, keyValue, keyName = 'id') => {
  if (items && Array.isArray(items)) {
    return items.find((element) => element[keyName] === keyValue);
  }
  if (items && typeof items === 'object') {
    return items[keyValue];
  }
  return null;
};

const convertArrayToObject = (sourceItems, keyName = 'id') => {
  const target = {};
  sourceItems.forEach((element) => {
    target[element[keyName]] = element;
  });
  return target;
};

const convertArrayToMap = (sourceItems, keyName = 'id') => {
  const target = new Map();
  sourceItems.forEach((element) => {
    target.set(element[keyName], element);
  });
  return target;
};

export { convertArrayToMap, convertArrayToObject, getItem };
