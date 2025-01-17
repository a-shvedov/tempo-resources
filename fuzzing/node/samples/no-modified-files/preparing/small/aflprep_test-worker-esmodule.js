'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const w = new Worker(fixtures.path('worker-script.mjs'));
w.on('message', common.mustCall((message) => {
  assert.strictEqual(message, 'Hello, world!');
}));
