'use strict';
/*global suite:false, test:false */


var assert = require('assert');
var subject = require('../lib/assert-paranoid-equal/utilities');


suite('Utilities', function () {
  var isNothing     = subject.isNothing,
      isObject      = subject.isObject,
      isNaNConstant = subject.isNaNConstant,
      isInstanceOf  = subject.isInstanceOf,
      collectKeys   = subject.collectKeys;

  test('function isNothing(subject)', function () {
    assert(isNothing(undefined));
    assert(isNothing(null));
    assert(!isNothing(42));
    assert(!isNothing('hello world'));
    assert(!isNothing(/^fo{1,5}/i));
    assert(!isNothing([ 1, 2, 3 ]));
    assert(!isNothing({ a: 42, b: 'show' }));
  });

  test('function isObject(subject)', function () {
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

  test('function isNaNConstant(subject)', function () {
    assert(isNaNConstant(NaN));
    assert(isNaNConstant(Number.NaN));
    assert(isNaNConstant(0 / 0));
     
    assert(!isNaNConstant(undefined));
    assert(!isNaNConstant({}));
    assert(!isNaNConstant(true));
    assert(!isNaNConstant(null));
    assert(!isNaNConstant(37));
    assert(!isNaNConstant('37'));
    assert(!isNaNConstant('37.37'));
    assert(!isNaNConstant(''));
    assert(!isNaNConstant(' '));
    assert(!isNaNConstant('NaN'));
    assert(!isNaNConstant('blabla'));
  });

  test('function isInstanceOf(constructor, subjects...)', function () {
    assert(isInstanceOf(Object, {}));
    assert(isInstanceOf(Object, new Array(10)));
    assert(isInstanceOf(Array, [ 1, 2, 3 ]));
    assert(isInstanceOf(Array, [ 1, 2, 3 ], [ 'hello', 'world' ]));
    assert(isInstanceOf(Date, new Date()));
    assert(!isInstanceOf(Array, [ 1, 2, 3 ], { greeting: 'hello' }));
    assert(!isInstanceOf(Array, new Date()));
    assert(!isInstanceOf(Date, new Array(42)));
  });

  test('function collectKeys(subject, include, exclude)', function () {
    var sample = { a: 12, b: 'hello' };

    function check(result, subject, include, exclude) {
      var keys, index, length;

      keys = collectKeys(subject, include, exclude);
      assert.strictEqual(keys.length, result.length);

      keys.sort();
      result.sort();

      for (index = 0, length = keys.length; index < length; index += 1) {
        assert.strictEqual(keys[index], result[index]);
      }
    }

    check([ 'a', 'b' ],      sample, [],      []);
    check([ 'a', 'b', 'c' ], sample, [ 'c' ], []);
    check([ 'a' ],           sample, [],      [ 'b' ]);
    check([ 'a', 'c' ],      sample, [ 'c' ], [ 'b' ]);
    check([ 'a', 'b' ],      sample, [ 'b' ], []);
    check([ 'a', 'b' ],      sample, [],      [ 'c' ]);
  });
});
