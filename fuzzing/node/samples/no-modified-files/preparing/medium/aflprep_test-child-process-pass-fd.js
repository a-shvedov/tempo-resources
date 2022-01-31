'use strict';
if (process.config.variables.arm_version === '7') {
  common.skip('Too slow for armv7 bots');
}
const assert = require('assert');
const { fork } = require('child_process');
const net = require('net');
const N = 80;
let messageCallbackCount = 0;
function forkWorker() {
  const messageCallback = (msg, handle) => {
    messageCallbackCount++;
    assert.strictEqual(msg, 'handle');
    assert.ok(handle);
    worker.send('got');
    let recvData = '';
    handle.on('data', common.mustCall((data) => {
      recvData += data;
    }));
    handle.on('end', () => {
      assert.strictEqual(recvData, 'hello');
      worker.kill();
    });
  };
  const worker = fork(__filename, ['child']);
  worker.on('error', (err) => {
      forkWorker();
      return;
    }
    throw err;
  });
  worker.once('message', messageCallback);
}
if (process.argv[2] !== 'child') {
  for (let i = 0; i < N; ++i) {
    forkWorker();
  }
  process.on('exit', () => { assert.strictEqual(messageCallbackCount, N); });
} else {
  let socket;
  let cbcalls = 0;
  function socketConnected() {
    if (++cbcalls === 2)
      process.send('handle', socket);
  }
  process.on('message', common.mustCall());
  const server = net.createServer((c) => {
    process.once('message', (msg) => {
      assert.strictEqual(msg, 'got');
      c.end('hello');
    });
    socketConnected();
  }).unref();
  server.listen(0, common.localhostIPv4, () => {
    const { port } = server.address();
    socket = net.connect(port, common.localhostIPv4, socketConnected).unref();
  });
}