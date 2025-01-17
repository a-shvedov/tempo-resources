'use strict';
const assert = require('assert');
let i;
const N = 30;
const done = [];
function get_printer(timeout) {
  return function() {
    console.log(`Running from setTimeout ${timeout}`);
    done.push(timeout);
  };
}
process.nextTick(function() {
  console.log('Running from nextTick');
  done.push('nextTick');
});
for (i = 0; i < N; i += 1) {
  setTimeout(get_printer(i), i);
}
console.log('Running from main.');
process.on('exit', function() {
  assert.strictEqual(done[0], 'nextTick');
});
