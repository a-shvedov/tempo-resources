'use strict';
const assert = require('assert');
const cares = internalBinding('cares_wrap');
const { promisify } = require('util');
const originalGetaddrinfo = cares.getaddrinfo;
const calls = [];
cares.getaddrinfo = common.mustCallAtLeast((...args) => {
  calls.push(args);
  originalGetaddrinfo(...args);
}, 1);
const dns = require('dns');
const dnsPromises = dns.promises;
let verbatim;
function allowFailed(fn) {
  return fn.catch((_err) => {
  });
}
(async () => {
  let callsLength = 0;
  const checkParameter = (expected) => {
    assert.strictEqual(calls.length, callsLength + 1);
    verbatim = calls[callsLength][4];
    assert.strictEqual(verbatim, expected);
    callsLength += 1;
  };
  await allowFailed(promisify(dns.lookup)('example.org'));
  checkParameter(true);
  await allowFailed(dnsPromises.lookup('example.org'));
  checkParameter(true);
  await allowFailed(promisify(dns.lookup)('example.org', {}));
  checkParameter(true);
  await allowFailed(dnsPromises.lookup('example.org', {}));
  checkParameter(true);
})().then(common.mustCall());