'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const stream = require('stream');
const fs = require('fs');
const path = require('path');
if (process.argv[2] === 'child') {
  console.log(JSON.stringify([process.stdout, process.stderr].map((stdio) => ({
    instance: stdio instanceof stream.Writable,
    readable: stdio.readable,
    writable: stdio.writable,
  }))));
  return;
}
tmpdir.refresh();
const filename = path.join(tmpdir.path, 'stdout');
const stdoutFd = fs.openSync(filename, 'w');
const proc = spawn(process.execPath, [__filename, 'child'], {
  stdio: ['inherit', stdoutFd, stdoutFd ]
});
proc.on('close', common.mustCall(() => {
  fs.closeSync(stdoutFd);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(filename, 'utf8')), [
    { instance: true, readable: false, writable: true },
    { instance: true, readable: false, writable: true },
  ]);
}));
