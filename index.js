'use strict';

//
// NOTE: It is usable but not finished yet.
// TODO: Remove code duplication
//


var assert = require('assert');
var util = require('util');


function makeReport(path, explanation) {
  var prefix     = '',
      parameters = [ explanation ],
      index,
      length     = path.length;

  if (arguments.length > 2) {
    parameters.concat(Array.prototype.slice.call(arguments, 2));
  }

  if (length > 0) {
    prefix += 'At object';

    for (index = 0; index < length; index += 1) {
      prefix += '[' + JSON.stringify(path[index]) + ']';
    }

    prefix += ': ';
  }

  return prefix + util.format.apply(parameters);
}


function ensureEqualValues(path, actual, expected) {
  var actualKind   = Object.prototype.toString.call(actual),
      expectedKind = Object.prototype.toString.call(expected);

  assert.strictEqual(actualKind, expectedKind,
    makeReport(path, 'Objects must be of same type'));

  if (actual === expected) {
    return;

  } else if (Number.isNaN(actual) && Number.isNaN(expected)) {
    return;

  } else {
    assert.strictEqual(
      Object.getPrototypeOf(actual),
      Object.getPrototypeOf(expected),
      makeReport(path, 'Objects has different prototypes'));
    
    if (actual instanceof Array &&
        expected instanceof Array) {
      ensureEqualArrays(path, actual, expected);

    } else if (actual instanceof Date &&
               expected instanceof Date) {
      ensureEqualDates(path, actual, expected);

    } else if (actual instanceof RegExp &&
               expected instanceof RegExp) {
      ensureEqualRegexps(path, actual, expected);

    } else {
      ensureEqualObjects(path, actual, expected);
    }
  }
}


function ensureEqualArrays(path, actual, expected) {
  var index, length;

  assert.strictEqual(actual.length, expected.length,
    makeReport(path, 'Arrays are not of same length'));

  for (index = 0, length = actual.length; index < length; index += 1) {
    ensureEqualValues(path.concat(index), actual[index], expected[index]);
  }
}


function ensureEqualDates(path, actual, expected) {
  var actualTime   = actual.getTime(),
      expectedTime = expected.getTime();

  assert.strictEqual(actualTime, expectedTime,
    makeReport(path,
      "Dates' timestamps are not equal (actual: %j, expected: %j)",
      actualTime,
      expectedTime));
}


function ensureEqualRegexps(path, actual, expected) {
  assert.strictEqual(actual.source, expected.source,
    makeReport(path,
      "Regexps' `source` properties are not equal (actual: %j, expected: %j)",
      actual.source,
      expected.source));

  assert.strictEqual(actual.lastIndex, expected.lastIndex,
    makeReport(path,
      "Regexps' `lastIndex` properties are not equal (actual: %j, expected: %j)",
      actual.lastIndex,
      expected.lastIndex));

  assert.strictEqual(actual.ignoreCase, expected.ignoreCase,
    makeReport(path,
      "Regexps' `ignoreCase` flags are not at same state (actual: %j, expected: %j)",
      actual.ignoreCase,
      expected.ignoreCase));

  assert.strictEqual(actual.global, expected.global,
    makeReport(path,
      "Regexps' `global` flags are not at same state (actual: %j, expected: %j)",
      actual.global,
      expected.global));

  assert.strictEqual(actual.multiline, expected.multiline,
    makeReport(path,
      "Regexps' `multiline` flags are not at same state (actual: %j, expected: %j)",
      actual.multiline,
      expected.multiline));
}


function ensureEqualObjects(path, actual, expected) {
  var actualKeys   = Object.keys(actual),
      expectedKeys = Object.keys(expected),
      index, length, key;

  assert.strictEqual(actualKeys.length, expectedKeys.length,
    makeReport(path, 'Objects has different numbers of own properies.'));

  actualKeys.sort();
  expectedKeys.sort();

  length = actualKeys.length;

  for (index = 0; index < length; index += 1) {
    assert.strictEqual(actualKeys[index], expectedKeys[index],
      makeReport(path, 'Objects has different sets of own properties.'));
  }

  for (index = 0; index < length; index += 1) {
    key = actualKeys[index];
    ensureEqualValues(path.concat(key), actual[key], expected[key]);
  }
}


function fullEqual(value1, value2) {
  assert.doesNotThrow(function () {
    ensureEqualValues([], value1, value2);
  }, assert.AssertionError);
}


function notFullEqual(value1, value2) {
  assert.throws(function () {
    ensureEqualValues([], value1, value2);
  }, assert.AssertionError);
}


module.exports.fullEqual    = fullEqual;
module.exports.notFullEqual = notFullEqual;
