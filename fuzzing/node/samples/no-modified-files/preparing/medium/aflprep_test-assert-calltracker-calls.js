'use strict';
const assert = require('assert');
const tracker = new assert.CallTracker();
function bar() {}
const err = {
  code: 'ERR_INVALID_ARG_TYPE',
};
assert.throws(() => {
  const callsbar = tracker.calls(bar, '1');
  callsbar();
}, err
);
assert.throws(() => {
  const callsbar = tracker.calls(bar, 0.1);
  callsbar();
}, { code: 'ERR_OUT_OF_RANGE' }
);
assert.throws(() => {
  const callsbar = tracker.calls(bar, true);
  callsbar();
}, err
);
assert.throws(() => {
  const callsbar = tracker.calls(bar, () => {});
  callsbar();
}, err
);
assert.throws(() => {
  const callsbar = tracker.calls(bar, null);
  callsbar();
}, err
);
process.on('exit', () => {
  assert.throws(() => tracker.calls(bar, 1), {
    code: 'ERR_UNAVAILABLE_DURING_EXIT',
  });
});
const msg = 'Expected to throw';
function func() {
  throw new Error(msg);
}
const callsfunc = tracker.calls(func, 1);
assert.throws(
  () => callsfunc(),
  { message: msg }
);
{
  const tracker = new assert.CallTracker();
  const callsNoop = tracker.calls(1);
  callsNoop();
  tracker.verify();
}
{
  const tracker = new assert.CallTracker();
  const callsNoop = tracker.calls(undefined, 1);
  callsNoop();
  tracker.verify();
}