'use strict';


var AssertionError = require('assert').AssertionError;
var ownUtils = require('./utilities');
var Context = require('./context');
var Report = require('./report');


function ensureEqual(context, actual, expected) {
  ensureEqualValues(
    context,
    typeof actual,
    typeof expected,
    'types');

  if (ownUtils.isObject(actual, expected)) {
    ensureEqualValues(
      context,
      Object.getPrototypeOf(actual),
      Object.getPrototypeOf(expected),
      'prototypes');
    
    if (ownUtils.isInstanceOf(Array, actual, expected)) {
      ensureEqualArrays(context, actual, expected);

    } else if (ownUtils.isInstanceOf(Date, actual, expected)) {
      ensureEqualDates(context, actual, expected);

    } else if (ownUtils.isInstanceOf(RegExp, actual, expected)) {
      ensureEqualRegexps(context, actual, expected);

    } else {
      ensureEqualObjects(context, actual, expected);
    }

  } else {
    ensureEqualValues(context, actual, expected, 'values');
  }
}


function ensureEqualValues(context, actual, expected, reason) {
  if (!(Number.isNaN(actual) && Number.isNaN(expected))) {
    if (actual !== expected) {
      throw new AssertionError({
        actual:   context.actual,
        expected: context.expected,
        operator: 'is fully equal to',
        message:  new Report(context, actual, expected, reason)
      });
    }
  }
}


function ensureEqualArrays(context, actual, expected) {
  var index, length;

  ensureEqualValues(context, actual.length, expected.length, 'length');

  for (index = 0, length = actual.length; index < length; index += 1) {
    ensureEqual(context.descent(index), actual[index], expected[index]);
  }
}


function ensureEqualDates(context, actual, expected) {
  var actualTime   = actual.getTime(),
      expectedTime = expected.getTime();

  ensureEqualValues(context, actualTime, expectedTime, 'dates');
}


function ensureEqualRegexps(context, actual, expected) {
  ['source',
   'lastIndex',
   'ignoreCase',
   'global',
   'multiline'].forEach(function () {
    ensureEqualValues(context.descent(key), actual[key], expected[key], 'regexps');
  });
}


function ensureEqualObjects(context, actual, expected) {
  var actualKeys   = Object.keys(actual),
      expectedKeys = Object.keys(expected),
      index, length, key;

  ensureEqualValues(context, actualKeys.length, expectedKeys.length, 'keys_count');

  actualKeys.sort();
  expectedKeys.sort();

  length = actualKeys.length;

  for (index = 0; index < length; index += 1) {
    ensureEqualValues(context, actualKeys[index], expectedKeys[index], 'keys_names');
  }

  for (index = 0; index < length; index += 1) {
    key = actualKeys[index];
    ensureEqual(context.descent(key), actual[key], expected[key]);
  }
}


module.exports.ensureEqual        = ensureEqual;
module.exports.ensureEqualValues  = ensureEqualValues;
module.exports.ensureEqualArrays  = ensureEqualArrays;
module.exports.ensureEqualDates   = ensureEqualDates;
module.exports.ensureEqualRegexps = ensureEqualRegexps;
module.exports.ensureEqualObjects = ensureEqualObjects;
