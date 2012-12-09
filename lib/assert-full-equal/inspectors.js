'use strict';


var assert = require('assert');
var ownUtils = require('./utilities');
var makeReport = require('./report').makeReport;


function ensureEqualValues(path, actual, expected) {
  assert.strictEqual(
    typeof actual,
    typeof expected,
    makeReport(path, 'Objects must be of same type'));


  if (ownUtils.isObject(actual, expected)) {
    assert.strictEqual(
      Object.getPrototypeOf(actual),
      Object.getPrototypeOf(expected),
      makeReport(path, 'Objects has different prototypes'));
    
    if (ownUtils.isInstanceOf(Array, actual, expected)) {
      ensureEqualArrays(path, actual, expected);

    } else if (ownUtils.isInstanceOf(Date, actual, expected)) {
      ensureEqualDates(path, actual, expected);

    } else if (ownUtils.isInstanceOf(RegExp, actual, expected)) {
      ensureEqualRegexps(path, actual, expected);

    } else {
      ensureEqualObjects(path, actual, expected);
    }

  } else if (!(Number.isNaN(actual) && Number.isNaN(expected))) {
    assert.strictEqual(actual, expected);
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


module.exports.ensureEqualValues  = ensureEqualValues;
module.exports.ensureEqualArrays  = ensureEqualArrays;
module.exports.ensureEqualDates   = ensureEqualDates;
module.exports.ensureEqualRegexps = ensureEqualRegexps;
module.exports.ensureEqualObjects = ensureEqualObjects;
