'use strict';
const assert = require('assert');
assert.notStrictEqual(test_symbol.New(), test_symbol.New());
assert.notStrictEqual(test_symbol.New('foo'), test_symbol.New('foo'));
assert.notStrictEqual(test_symbol.New('foo'), test_symbol.New('bar'));
const foo1 = test_symbol.New('foo');
const foo2 = test_symbol.New('foo');
const object = {
  [foo1]: 1,
  [foo2]: 2,
};
assert.strictEqual(object[foo1], 1);
assert.strictEqual(object[foo2], 2);
