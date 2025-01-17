'use strict';
const assert = require('assert');
const { fork, spawn } = require('child_process');
switch (process.argv[2] || '') {
  case '':
    fork(__filename, ['fork']).on('exit', common.mustCall(checkExit));
    break;
  case 'fork':
    spawn(process.execPath, [__filename, 'spawn'])
      .on('exit', common.mustCall(checkExit));
    break;
  case 'spawn':
    break;
  default:
    assert.fail();
}
function checkExit(statusCode) {
  assert.strictEqual(statusCode, 0);
}
