'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
const assert = require('assert');
const { fork } = require('child_process');
if (process.argv[2] === 'test')
  return test();
if (!binding('tls_wrap').HAVE_SSL_TRACE)
  return common.skip('no SSL_trace() compiled into openssl');
const child = fork(__filename, ['test'], { silent: true });
let stderr = '';
child.stderr.setEncoding('utf8');
child.stderr.on('data', (data) => stderr += data);
child.on('close', common.mustCall(() => {
}));
child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);
child.on('exit', common.mustCall((code) => {
  assert.strictEqual(code, 0);
}));
function test() {
  const {
    connect, keys
  } = require(fixtures.path('tls-connect'));
  connect({
    client: {
      checkServerIdentity: (servername, cert) => { },
      ca: `${keys.agent1.cert}\n${keys.agent6.ca}`,
    },
    server: {
      cert: keys.agent6.cert,
      key: keys.agent6.key,
      enableTrace: true,
    },
  }, common.mustCall((err, pair, cleanup) => {
    pair.client.conn.enableTrace();
    return cleanup();
  }));
}