'use strict';
const path = require('path');
const assert = require('assert');
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  const relativePath = path.relative('.', __filename);
  const w = new Worker(path.join('..', cwdName, relativePath));
  w.on('message', common.mustCall((message) => {
    assert.strictEqual(message, 'Hello, world!');
  }));
} else {
  parentPort.postMessage('Hello, world!');
}
