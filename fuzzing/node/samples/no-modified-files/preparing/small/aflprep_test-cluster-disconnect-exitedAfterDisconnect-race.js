'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isPrimary) {
  cluster.on('exit', (worker, code) => {
    assert.strictEqual(code, 0, `worker exited with code: ${code}, expected 0`);
  });
  return cluster.fork();
}
let eventFired = false;
cluster.worker.disconnect();
process.nextTick(common.mustCall(() => {
  assert.ok(!eventFired, 'disconnect event should wait for ack');
}));
cluster.worker.on('disconnect', common.mustCall(() => {
  eventFired = true;
}));
