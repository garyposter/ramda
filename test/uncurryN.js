var assert = require('assert');

var R = require('..');


describe('uncurryN', function() {
  function a2(a) {
    return function(b) {
      return a + b;
    };
  }

  function a3(a) {
    return function(b) {
      return function(c) {
        return a + b + c;
      };
    };
  }

  function a3b(a) {
    return function(b) {
      return function(c) {
        return a + b + c + (arguments[1] || 0) + (arguments[2] || 0);
      };
    };
  }

  function a4(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return a + b + c + d;
        };
      };
    };
  }

  it('accepts an arity', function() {
    var uncurried = R.uncurryN(3, a3);
    assert.strictEqual(uncurried(1, 2, 3), 6);
  });

  it('returns a function of the specified arity', function() {
    assert.strictEqual(R.uncurryN(2, a2).length, 2);
    assert.strictEqual(R.uncurryN(3, a3).length, 3);
    assert.strictEqual(R.uncurryN(4, a4).length, 4);
  });

  it('forwards extra arguments', function() {
    var g = R.uncurryN(3, a3b);

    assert.deepEqual(g(1, 2, 3), 6);
    assert.deepEqual(g(1, 2, 3, 4), 10);
    assert.deepEqual(g(1, 2, 3, 4, 5), 15);
  });

  it('works with ordinary uncurried functions', function() {
    assert.strictEqual(R.uncurryN(2, function(a, b) { return a + b; })(10, 20), 30);
    assert.strictEqual(R.uncurryN(3, function(a, b, c) { return a + b + c; })(10, 20, 30), 60);
  });

  it('works with ramda-curried functions', function() {
    assert.strictEqual(R.uncurryN(2, R.add)(10, 20), 30);
  });

  it('returns a function that supports R.__ placeholder', function() {
    var g = R.uncurryN(3, a3);
    var _ = R.__;

    assert.deepEqual(g(1)(2)(3), 6);
    assert.deepEqual(g(1)(2, 3), 6);
    assert.deepEqual(g(1, 2)(3), 6);
    assert.deepEqual(g(1, 2, 3), 6);

    assert.deepEqual(g(_, 2, 3)(1), 6);
    assert.deepEqual(g(1, _, 3)(2), 6);
    assert.deepEqual(g(1, 2, _)(3), 6);

    assert.deepEqual(g(1, _, _)(2)(3), 6);
    assert.deepEqual(g(_, 2, _)(1)(3), 6);
    assert.deepEqual(g(_, _, 3)(1)(2), 6);

    assert.deepEqual(g(1, _, _)(2, 3), 6);
    assert.deepEqual(g(_, 2, _)(1, 3), 6);
    assert.deepEqual(g(_, _, 3)(1, 2), 6);

    assert.deepEqual(g(1, _, _)(_, 3)(2), 6);
    assert.deepEqual(g(_, 2, _)(_, 3)(1), 6);
    assert.deepEqual(g(_, _, 3)(_, 2)(1), 6);

    assert.deepEqual(g(_, _, _)(_, _)(_)(1, 2, 3), 6);
    assert.deepEqual(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), 6);
  });
});
