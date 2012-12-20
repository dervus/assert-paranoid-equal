# assert-paranoid-equal

[![Build Status](https://travis-ci.org/dervus/assert-paranoid-equal.png?branch=master)](https://travis-ci.org/dervus/assert-paranoid-equal)

An addition to [Node's assertion library] provides a paranoid (and
enhanced) variant of deepEqual.



## Features

 * It ensures the given objects have exactly the same prototype.
 * It walks through _every_ own property of an object including
   non-enumerables.
 * It treats subclasses of `Date`, `RegExp` and `Buffer`.
 * It assumes NaN is equal to NaN.
 * It throws from the place where the discrepancy was detected. So you
   should have full stack trace of the inspection process.
 * It throws `AssertionError` from Node's `assert` module with special
   Report object as the message. That object provides information about
   where the given objects are not equal and why.



## Usage

Install it via Node Package Manager:

    npm install assert-paranoid-equal

Then it can be used like so:

    var enhancedAssert = require('assert-paranoid-equal');

    enhancedAssert.paranoidEqual(42, 42);
    enhancedAssert.paranoidEqual(NaN, NaN);
    enhancedAssert.notParanoidEqual(null, undefined);

Look at the tests if you want more examples.



## Report object

When the given objects are not equal at some point, paranoidEqual throws
`AssertionError` from Node's `assert` module. It assigns `actual` and
`expected` properties to the given top-level objects and `message` to
newly constructed Report object.

Report objects contain the following properties:

 * `reason`     — Machine-friendly reason identifier. See the source
                  code for details.
 * `expected`   — Expected top-level object.
 * `actual`     — Actual top-level object.
 * `context`    — Special Context object. It contains:
   * `path`     — Position (array of keys) within the object where the
                  discrepancy was detected.
   * `expected` — Expected check value at the given path.
   * `actual`   — Actual check value at the given path.

Also Report objects have `.toString()` method, which returns
human-friendly description of the error.



## License

assert-paranoid-equal is released under the [MIT License].



[Node's assertion library]: http://nodejs.org/api/assert.html
[MIT License]: http://www.opensource.org/licenses/MIT
