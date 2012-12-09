'use strict';


var assert = require('assert');
var inspectors = require('./assert-full-equal/inspectors');


function fullEqual(value1, value2) {
  inspectors.ensureEqualValues([], value1, value2);
}


function notFullEqual(value1, value2) {
  assert.throws(
    function () { fullEqual(value1, value2); },
    assert.AssertionError,
    'Given objects are equal, witch is not expected.');
}


module.exports.fullEqual    = fullEqual;
module.exports.notFullEqual = notFullEqual;
