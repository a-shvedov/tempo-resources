'use strict';
if (common.isWindows)
  common.skip('no RLIMIT_NOFILE on Windows');
const assert = require('assert');
const exec = require('child_process').exec;
let cmdline = `ulimit -c 0; ${process.execPath}`;
cmdline += ' --max-old-space-size=4 --max-semi-space-size=1';
cmdline += ' -e "a = []; for (i = 0; i < 1e9; i++) { a.push({}) }"';
exec(cmdline, function(err, stdout, stderr) {
  if (!err) {
    console.log(stdout);
    console.log(stderr);
    assert(false, 'this test should fail');
    return;
  }
  if (err.code !== 134 && err.signal !== 'SIGABRT') {
    console.log(stdout);
    console.log(stderr);
    console.log(err);
    assert(false, err);
  }
});
