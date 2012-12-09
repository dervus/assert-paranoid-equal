'use strict';


function isObject(/* subjects... */) {
  var index,
      length = arguments.length,
      current;

  if (length < 1) {
    return false;
  }

  for (index = 0; index < length; index += 1) {
    current = arguments[index];

    if (('object' !== typeof current) || (null === current)) {
      return false;
    }
  }

  return true;
}


function isInstanceOf(constructor /*, subjects... */) {
  var index,
      length = arguments.length;

  if (length < 2) {
    return false;
  }

  for (index = 1; index < length; index += 1) {
    if (!(arguments[index] instanceof constructor)) {
      return false;
    }
  }

  return true;
}


function xor(left, right) {
  return (left && !right) || (!left && right);
}


module.exports.isObject = isObject;
module.exports.isInstanceOf = isInstanceOf;
module.exports.xor = xor;
