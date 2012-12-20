'use strict';
/*global suite:false, test:false */


var util = require('util');
var assert = require('assert');
var subject = require('../lib/assert-paranoid-equal');


suite('Functional', function () {

  function ok(actual, expected) {
    subject.paranoidEqual(actual, expected);
  }

  function fail(actual, expected) {
    try {
      subject.paranoidEqual(actual, expected);
    } catch (exception) {
      if (exception instanceof assert.AssertionError) {
        return;
      }
    }

    throw new Error(
      util.inspect(actual) +
      ' should not be paranoidly equal to ' +
      util.inspect(expected));
  }

  test('Objects of different types are not equal', function () {
    fail(42, 'answer');
    fail(false, null);
  });

  test('NaN is equal to NaN', function () {
    ok(NaN, NaN);
    fail(NaN, 42);
    fail(null, NaN);
  });

  test('Null objects', function () {
    ok(null, null);
  });

  test('Number objects', function () {
    ok(-346, -346);
    ok(0, 0);
    ok(2376, 2376);
    ok(-672.234, -672.234);
    ok(9.358546212888048e-14, 9.358546212888048e-14);
    fail(5, -5);
    fail(8234, 7823);
    fail(-564.23466, 0.236852109);
    fail(9.358546212888048e-14, 9.358546212888047e-14);
  });

  test('String objects', function () {
    ok('hello world', 'hello world');
    fail('john', 'joe');
  });

  test('RegExp objects', function () {
    ok((/hello/i), (/hello/i));
    ok((/hello\s+[wv]orlds?/g), (/hello\s+[wv]orlds?/g));
    fail((/hello/i), (/world/i));
    fail((/rain/i), (/rain/ig));
  });

  test('Date objects', function () {
    ok(new Date(2012, 12, 21), new Date(2012, 12, 21));
    ok(new Date('2001-12-14T21:59:43.10Z'), new Date(1008367183100));
    fail(new Date(2005, 4, 25), new Date(2005, 2, 25));
    fail(new Date(2005, 4, 10, 12, 33, 9, 781), new Date(2005, 4, 10, 12, 33, 9, 782));
  });

  test('Buffer objects', function () {
    ok(new Buffer([ 1, 2, 3, 4 ]), new Buffer([ 1, 2, 3, 4 ]));
    fail(new Buffer([ 1, 2, 3, 4 ]), new Buffer([ 1, 2, 3 ]));
    fail(new Buffer([ 1, 2, 3, 4 ]), new Buffer([ 1, 2, 4, 3 ]));
  });

  test('Flat Array objects', function () {
    ok([1, 2, 3, 4], [1, 2, 3, 4]);
    fail([2, 1, 4], [1, 2, 4]);
  });

  test('Nested Array objects', function () {
    ok([5, 6, [9, 3], 7], [5, 6, [9, 3], 7]);
    fail([7, 7, [3, 8, 1], 1], [7, 7, [], 1]);
  });

  test('Flat hash-like objects', function () {
    var object = {
      x: 12,
      y: 34,
      z: -3
    };

    ok(object, { x: 12, y: 34, z: -3 });
    ok(object, { z: -3, x: 12, y: 34 });
    fail(object, { x: 12, y: 34, z: -3, trash: 0 });
    fail(object, { x: 12, y: 34 });
  });

  test('Nested hash-like objects', function () {
    var object = {
      foo: 'hello',
      bar: {
        baz: 42
      }
    };

    ok(object, { bar: { baz: 42 }, foo: 'hello' });
    fail(object, { foo: 'hello' });
    fail(object, { bar: { baz: 42 } });
    fail(object, { bar: { baz: null }, foo: 'hello' });
  });

  test('Custom constructed objects', function () {
    function Foo(x, y) {
      this.x = x;
      this.y = y;
    }

    function Bar(text) {
      this.text = text;
    }

    function Baz() {
      Bar.apply(this, arguments);
    }
    util.inherits(Baz, Bar);

    ok(new Foo(1, 2), new Foo(1, 2));
    fail(new Foo(1, 2), new Foo(1, 4));
    ok(new Bar('hello'), new Bar('hello'));
    fail(new Bar('snow'), new Bar('stone'));
    fail(new Bar('world'), new Baz('world'));
  });
});
