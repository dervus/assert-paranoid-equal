'use strict';


var nodeUtils = require('util');


var REASONS = {
  'values'     : 'Given objects are not equal',
  'types'      : 'Given objects are of different types',
  'prototypes' : 'Given objects has different prototypes',
  'keys_count' : 'Given objects has diffetent key amounts',
  'keys_names' : 'Given objects has different key sets',
  'properties' : 'Given objects has different properties',
  'length'     : 'Given arrays are not equal in length',
  'items'      : 'Given arrays has different item sets',
  'dates'      : 'Given Data objects has different timestamps',
  'regexps'    : 'Given RegExp objects are not equal'
};


function Report(context, actual, expected, reason) {
  this.context  = context;
  this.actual   = actual;
  this.expected = expected;
  this.reason   = reason;

  if (!REASONS.hasOwnProperty(this.reason)) {
    throw Error('Unknown reason for the report: ' + JSON.stringify(this.reason));
  }
}


Report.prototype.toString = function toString() {
  var result = '',
      index,
      path   = this.context.path,
      length = path.length;

  result += REASONS[this.reason];

  if (length > 0) {
    result += ' at ';

    for (index = 0; index < length; index += 1) {
      result += '[' + JSON.stringify(path[index]) + ']';
    }
  }

  result +=
    ' (actual: '   + nodeUtils.inspect(this.actual) +
    ', expected: ' + nodeUtils.inspect(this.expected) + ')';

  return result;
}


module.exports = Report;
