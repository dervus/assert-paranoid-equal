'use strict';


var assert = require('assert');
var subject = require('../lib/assert-full-equal/utilities');


describe('Utilities', function () {
  var isObject     = subject.isObject,
      isInstanceOf = subject.isInstanceOf;

  it('function isObject(subjects...)', function () {
    assert(isObject({}));
    assert(isObject({ a: 10, b: 'hello' }));
    assert(isObject([ 1, 2, 'world' ]));
    assert(isObject(new Date()));
    assert(isObject(/^hello\s+[wv]orlds?/i));
    assert(!isObject(null));
    assert(!isObject(undefined));
    assert(!isObject(42));
    assert(!isObject('John Show'));
  });

  it('function isInstanceOf(constructor, subjects...)', function () {
    assert(isInstanceOf(Object, new Object()));
    assert(isInstanceOf(Object, new Array(10)));
    assert(isInstanceOf(Array, [ 1, 2, 3 ]));
    assert(isInstanceOf(Array, [ 1, 2, 3 ], [ 'hello', 'world' ]));
    assert(isInstanceOf(Date, new Date()));
    assert(!isInstanceOf(Array, [ 1, 2, 3 ], { greeting: 'hello' }));
    assert(!isInstanceOf(Array, new Date()));
    assert(!isInstanceOf(Date, new Array(42)));
  });
});
