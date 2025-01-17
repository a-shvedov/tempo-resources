'use strict';
const assert = require('assert');
const vm = require('vm');
const { Worker, isMainThread } = require('worker_threads');
assert(Object.prototype.hasOwnProperty('__proto__'));
assert.throws(() => {
  ({}).__proto__;
}, {
  code: 'ERR_PROTO_ACCESS'
});
assert.throws(() => {
  ({}).__proto__ = {};
}, {
  code: 'ERR_PROTO_ACCESS',
});
const ctx = vm.createContext();
assert.throws(() => {
  vm.runInContext('({}).__proto__;', ctx);
}, {
  code: 'ERR_PROTO_ACCESS'
});
assert.throws(() => {
  vm.runInContext('({}).__proto__ = {};', ctx);
}, {
  code: 'ERR_PROTO_ACCESS',
});
if (isMainThread) {
  new Worker(__filename);
} else {
  process.exit();
}
