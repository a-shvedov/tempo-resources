'use strict';
const assert = require('assert');
let cntr = 0;
let first;
const t = setInterval(() => {
  cntr++;
  if (cntr === 1) {
    sleep(100);
    setImmediate(() => assert.strictEqual(cntr, 1));
    first = Date.now();
  } else if (cntr === 2) {
    assert(Date.now() - first < 100);
    clearInterval(t);
  }
}, 100);
const t2 = setInterval(() => {
  if (cntr === 2) {
    clearInterval(t2);
  }
}, 100);
