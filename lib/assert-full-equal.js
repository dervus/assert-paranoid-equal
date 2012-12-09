'use strict';


var assert = require('assert');
var inspectors = require('./assert-full-equal/inspectors');


function fullEqual(value1, value2) {
  assert.doesNotThrow(function () {
    inspectors.ensureEqualValues([], value1, value2);
  }, assert.AssertionError);
}


function notFullEqual(value1, value2) {
  assert.throws(function () {
    inspectors.ensureEqualValues([], value1, value2);
  }, assert.AssertionError);
}


module.exports.fullEqual    = fullEqual;
module.exports.notFullEqual = notFullEqual;
