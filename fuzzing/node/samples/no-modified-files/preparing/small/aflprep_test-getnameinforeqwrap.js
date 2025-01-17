'use strict';
const assert = require('assert');
const dns = require('dns');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different async IDs');
const hooks = initHooks();
hooks.enable();
dns.lookupService('127.0.0.1', 80, common.mustCall(onlookupService));
function onlookupService() {
  const as = hooks.activitiesOfTypes('GETNAMEINFOREQWRAP');
  assert.strictEqual(as.length, 1);
  const a = as[0];
  assert.strictEqual(a.type, 'GETNAMEINFOREQWRAP');
  assert.strictEqual(typeof a.uid, 'number');
  assert.strictEqual(a.triggerAsyncId, 1);
  checkInvocations(a, { init: 1, before: 1 },
                   'while in onlookupService callback');
  tick(2);
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('GETNAMEINFOREQWRAP');
  const as = hooks.activitiesOfTypes('GETNAMEINFOREQWRAP');
  const a = as[0];
  checkInvocations(a, { init: 1, before: 1, after: 1, destroy: 1 },
                   'when process exits');
}
