'use strict';
const assert = require('assert');
const { performance } = require('perf_hooks');
{
  assert.strictEqual(typeof performance.toJSON, 'function');
  const jsonObject = performance.toJSON();
  assert.strictEqual(typeof jsonObject, 'object');
  assert.strictEqual(jsonObject.timeOrigin, performance.timeOrigin);
  assert.strictEqual(typeof jsonObject.nodeTiming, 'object');
}
