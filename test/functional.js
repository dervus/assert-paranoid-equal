'use strict';


var util = require('util');
var assert = require('assert');
var subject = require('../lib/assert-full-equal');


describe('Functional', function () {

  function fullEqual(actual, expected) {
    assert.doesNotThrow(function () {
      subject.fullEqual(actual, expected);
    }, assert.AssertionError);
  }

  function notFullEqual(actual, expected) {
    assert.throws(function () {
      subject.fullEqual(actual, expected);
    }, assert.AssertionError);
  }

  it('should throw when the objects are of different types', function () {
    notFullEqual(42, 'answer');
    notFullEqual(false, null);
  });

  it('should pass when both of the objects are NaN', function () {
    fullEqual(NaN, NaN);
    notFullEqual(NaN, 42);
    notFullEqual(null, NaN);
  });

  it('should treat nulls', function () {
    fullEqual(null, null);
  });

  it('should treat numbers', function () {
    fullEqual(-346, -346);
    fullEqual(0, 0);
    fullEqual(2376, 2376);
    fullEqual(-672.234, -672.234);
    fullEqual(9.358546212888048e-14, 9.358546212888048e-14);
    notFullEqual(5, -5);
    notFullEqual(8234, 7823);
    notFullEqual(-564.23466, 0.236852109);
    notFullEqual(9.358546212888048e-14, 9.358546212888047e-14);
  });

  it('should treat strings', function () {
    fullEqual('hello world', 'hello world');
    notFullEqual('john', 'joe');
  });

  it('should treat regexps', function () {
    fullEqual((/hello/i), (/hello/i));
    fullEqual((/hello\s+[wv]orlds?/g), (/hello\s+[wv]orlds?/g));
    notFullEqual((/hello/i), (/world/i));
    notFullEqual((/rain/i), (/rain/ig));
  });

  it('should treat dates', function () {
    fullEqual(new Date(2012, 12, 21), new Date(1358722800000));
    fullEqual(new Date('2001-12-14t21:59:43.10-05:00'), new Date(1008385183100));
    notFullEqual(new Date(2005, 4, 25), new Date(2005, 2, 25));
    notFullEqual(new Date(2005, 4, 10, 12, 33, 9, 781), new Date(2005, 4, 10, 12, 33, 9, 782));
  });

  it('should treat flat arrays', function () {
    fullEqual([1, 2, 3, 4], [1, 2, 3, 4]);
    notFullEqual([2, 1, 4], [1, 2, 4]);
  });

  it('should treat nested arrays', function () {
    fullEqual([5, 6, [9, 3], 7], [5, 6, [9, 3], 7]);
    notFullEqual([7, 7, [3, 8, 1], 1], [7, 7, [], 1]);
  });

  it('should treat flat hash-like objects', function () {
    var object = {
      x: 12,
      y: 34,
      z: -3
    };

    fullEqual(object, { x: 12, y: 34, z: -3 });
    fullEqual(object, { z: -3, x: 12, y: 34 });
    notFullEqual(object, { x: 12, y: 34, z: -3, trash: 0 });
    notFullEqual(object, { x: 12, y: 34 });
  });

  it('should treat nested hash-like objects', function () {
    var object = {
      foo: 'hello',
      bar: {
        baz: 42
      }
    };

    fullEqual(object, { bar: { baz: 42 }, foo: 'hello' });
    notFullEqual(object, { foo: 'hello' });
    notFullEqual(object, { bar: { baz: 42 } });
    notFullEqual(object, { bar: { baz: null }, foo: 'hello' });
  });

  it('should treat constructed objects', function () {
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

    fullEqual(new Foo(1, 2), new Foo(1, 2));
    notFullEqual(new Foo(1, 2), new Foo(1, 4));
    fullEqual(new Bar('hello'), new Bar('hello'));
    notFullEqual(new Bar('snow'), new Bar('stone'));
    notFullEqual(new Bar('world'), new Baz('world'));
  });
});
