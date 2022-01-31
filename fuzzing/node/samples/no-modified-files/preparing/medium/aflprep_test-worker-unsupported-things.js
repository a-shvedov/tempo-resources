'use strict';
const assert = require('assert');
const { Worker, parentPort } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename);
  w.on('message', common.mustCall((message) => {
    assert.strictEqual(message, true);
  }));
} else {
  {
    const before = process.title;
    process.title += ' in worker';
    assert.strictEqual(process.title, before);
  }
  {
    const before = process.debugPort;
    process.debugPort++;
    assert.strictEqual(process.debugPort, before);
  }
  {
    const mask = 0o600;
    assert.throws(() => { process.umask(mask); }, {
      code: 'ERR_WORKER_UNSUPPORTED_OPERATION',
      message: 'Setting process.umask() is not supported in workers'
    });
  }
  const stubs = ['abort', 'chdir', 'send', 'disconnect'];
  if (!common.isWindows) {
    stubs.push('setuid', 'seteuid', 'setgid',
               'setegid', 'setgroups', 'initgroups');
  }
  stubs.forEach((fn) => {
    assert.strictEqual(process[fn].disabled, true);
    assert.throws(() => {
      process[fn]();
    }, {
      code: 'ERR_WORKER_UNSUPPORTED_OPERATION',
      message: `process.${fn}() is not supported in workers`
    });
  });
  ['channel', 'connected'].forEach((fn) => {
    assert.throws(() => {
    }, {
      code: 'ERR_WORKER_UNSUPPORTED_OPERATION',
      message: `process.${fn} is not supported in workers`
    });
  });
  assert.strictEqual('_startProfilerIdleNotifier' in process, false);
  assert.strictEqual('_stopProfilerIdleNotifier' in process, false);
  assert.strictEqual('_debugProcess' in process, false);
  assert.strictEqual('_debugPause' in process, false);
  assert.strictEqual('_debugEnd' in process, false);
  parentPort.postMessage(true);
}