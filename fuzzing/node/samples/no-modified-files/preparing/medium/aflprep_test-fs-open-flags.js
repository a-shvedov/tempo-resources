'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { O_APPEND = 0,
        O_CREAT = 0,
        O_EXCL = 0,
        O_RDONLY = 0,
        O_RDWR = 0,
        O_SYNC = 0,
        O_DSYNC = 0,
        O_TRUNC = 0,
        O_WRONLY = 0 } = fs.constants;
assert.strictEqual(stringToFlags('r'), O_RDONLY);
assert.strictEqual(stringToFlags('r+'), O_RDWR);
assert.strictEqual(stringToFlags('rs+'), O_RDWR | O_SYNC);
assert.strictEqual(stringToFlags('sr+'), O_RDWR | O_SYNC);
assert.strictEqual(stringToFlags('w'), O_TRUNC | O_CREAT | O_WRONLY);
assert.strictEqual(stringToFlags('w+'), O_TRUNC | O_CREAT | O_RDWR);
assert.strictEqual(stringToFlags('a'), O_APPEND | O_CREAT | O_WRONLY);
assert.strictEqual(stringToFlags('a+'), O_APPEND | O_CREAT | O_RDWR);
assert.strictEqual(stringToFlags('wx'), O_TRUNC | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('xw'), O_TRUNC | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('wx+'), O_TRUNC | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('xw+'), O_TRUNC | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('ax'), O_APPEND | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('xa'), O_APPEND | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('as'), O_APPEND | O_CREAT | O_WRONLY | O_SYNC);
assert.strictEqual(stringToFlags('sa'), O_APPEND | O_CREAT | O_WRONLY | O_SYNC);
assert.strictEqual(stringToFlags('ax+'), O_APPEND | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('xa+'), O_APPEND | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('as+'), O_APPEND | O_CREAT | O_RDWR | O_SYNC);
assert.strictEqual(stringToFlags('sa+'), O_APPEND | O_CREAT | O_RDWR | O_SYNC);
('+ +a +r +w rw wa war raw r++ a++ w++ x +x x+ rx rx+ wxx wax xwx xxx')
  .split(' ')
  .forEach(function(flags) {
    assert.throws(
      () => stringToFlags(flags),
      { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' }
    );
  });
assert.throws(
  () => stringToFlags({}),
  { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' }
);
assert.throws(
  () => stringToFlags(true),
  { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' }
);
if (common.isLinux || common.isOSX) {
  tmpdir.refresh();
  const file = path.join(tmpdir.path, 'a.js');
  fs.copyFileSync(fixtures.path('a.js'), file);
  fs.open(file, O_DSYNC, common.mustSucceed((fd) => {
    fs.closeSync(fd);
  }));
}