'use strict';
const assert = require('assert');
const cluster = require('cluster');
const fork = require('child_process').fork;
const net = require('net');
if (cluster.isPrimary && process.argv.length !== 3) {
  tmpdir.refresh();
  const PIPE_NAME = common.PIPE;
  const worker = cluster.fork({ PIPE_NAME });
  cluster.on('fork', common.mustCall());
  worker.on('online', common.mustCall());
  worker.on('message', common.mustCall(function(err) {
    worker.disconnect();
    assert.strictEqual(err.code, 'EADDRINUSE');
  }));
} else if (process.argv.length !== 3) {
  const PIPE_NAME = process.env.PIPE_NAME;
  const cp = fork(__filename, [PIPE_NAME], { stdio: 'inherit' });
  cp.on('message', common.mustCall(function() {
    const server = net.createServer().listen(PIPE_NAME, function() {
      cp.send('end');
      process.send('PIPE should have been in use.');
    });
    server.on('error', function(err) {
      cp.send('end');
      process.send(err);
    });
  }));
} else if (process.argv.length === 3) {
  const PIPE_NAME = process.argv[2];
  const server = net.createServer().listen(PIPE_NAME, common.mustCall(() => {
    process.send('listening');
  }));
  process.once('message', common.mustCall(() => server.close()));
} else {
  assert.fail('Impossible state');
}