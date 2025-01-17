'use strict';
const assert = require('assert');
assert.strictEqual(process.hasUncaughtExceptionCaptureCallback(), false);
process.setUncaughtExceptionCaptureCallback(common.mustCall((err) => {
  assert.strictEqual(err.message, 'foo');
}));
throw new Error('foo');
