'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const testCases = [
  { ca: ['ca1-cert'],
    key: 'agent2-key',
    cert: 'agent2-cert',
    servers: [
      { ok: true, key: 'agent1-key', cert: 'agent1-cert' },
      { ok: false, key: 'agent2-key', cert: 'agent2-cert' },
      { ok: false, key: 'agent3-key', cert: 'agent3-cert' },
    ] },
  { ca: [],
    key: 'agent2-key',
    cert: 'agent2-cert',
    servers: [
      { ok: false, key: 'agent1-key', cert: 'agent1-cert' },
      { ok: false, key: 'agent2-key', cert: 'agent2-cert' },
      { ok: false, key: 'agent3-key', cert: 'agent3-cert' },
    ] },
  { ca: ['ca1-cert', 'ca2-cert'],
    key: 'agent2-key',
    cert: 'agent2-cert',
    servers: [
      { ok: true, key: 'agent1-key', cert: 'agent1-cert' },
      { ok: false, key: 'agent2-key', cert: 'agent2-cert' },
      { ok: true, key: 'agent3-key', cert: 'agent3-cert' },
    ] },
];
function loadPEM(n) {
  return fixtures.readKey(`${n}.pem`);
}
let successfulTests = 0;
function testServers(index, servers, clientOptions, cb) {
  const serverOptions = servers[index];
  if (!serverOptions) {
    cb();
    return;
  }
  const ok = serverOptions.ok;
  if (serverOptions.key) {
    serverOptions.key = loadPEM(serverOptions.key);
  }
  if (serverOptions.cert) {
    serverOptions.cert = loadPEM(serverOptions.cert);
  }
  const server = tls.createServer(serverOptions, common.mustCall(function(s) {
    s.end('hello world\n');
  }));
  server.listen(0, common.mustCall(function() {
    let b = '';
    console.error('connecting...');
    clientOptions.port = this.address().port;
    const client = tls.connect(clientOptions, common.mustCall(function() {
      const authorized = client.authorized ||
          (client.authorizationError === 'ERR_TLS_CERT_ALTNAME_INVALID');
      console.error(`expected: ${ok} authed: ${authorized}`);
      assert.strictEqual(authorized, ok);
      server.close();
    }));
    client.on('data', function(d) {
      b += d.toString();
    });
    client.on('end', common.mustCall(function() {
      assert.strictEqual(b, 'hello world\n');
    }));
    client.on('close', common.mustCall(function() {
      testServers(index + 1, servers, clientOptions, cb);
    }));
  }));
}
function runTest(testIndex) {
  const tcase = testCases[testIndex];
  if (!tcase) return;
  const clientOptions = {
    port: undefined,
    ca: tcase.ca.map(loadPEM),
    key: loadPEM(tcase.key),
    cert: loadPEM(tcase.cert),
    rejectUnauthorized: false
  };
  testServers(0, tcase.servers, clientOptions, common.mustCall(function() {
    successfulTests++;
    runTest(testIndex + 1);
  }));
}
runTest(0);
process.on('exit', function() {
  console.log(`successful tests: ${successfulTests}`);
  assert.strictEqual(successfulTests, testCases.length);
});