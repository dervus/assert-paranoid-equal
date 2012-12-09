'use strict';


var nodeUtils = require('util');


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

  return prefix + nodeUtils.format.apply(parameters);
}


module.exports.makeReport = makeReport;
