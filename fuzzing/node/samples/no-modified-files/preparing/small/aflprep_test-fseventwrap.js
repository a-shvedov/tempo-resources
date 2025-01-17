'use strict';
const assert = require('assert');
const fs = require('fs');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different async IDs');
if (common.isIBMi)
  common.skip('IBMi does not support fs.watch()');
const hooks = initHooks();
hooks.enable();
const watcher = fs.watch(__filename, onwatcherChanged);
function onwatcherChanged() { }
watcher.close();
tick(2);
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('FSEVENTWRAP');
  const as = hooks.activitiesOfTypes('FSEVENTWRAP');
  assert.strictEqual(as.length, 1);
  const a = as[0];
  assert.strictEqual(a.type, 'FSEVENTWRAP');
  assert.strictEqual(typeof a.uid, 'number');
  assert.strictEqual(a.triggerAsyncId, 1);
  checkInvocations(a, { init: 1, destroy: 1 }, 'when process exits');
}
