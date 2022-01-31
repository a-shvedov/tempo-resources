'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
};
const messageUtf8 = 'x√ab c';
const messageAscii = 'xb\b\u001aab c';
const server = tls.Server(options, common.mustCall(function(socket) {
  console.log('server: on secureConnection', socket.getProtocol());
  socket.end(messageUtf8);
}));
server.listen(0, function() {
  const client = tls.connect({
    port: this.address().port,
    rejectUnauthorized: false
  });
  let buffer = '';
  client.setEncoding('ascii');
  client.on('data', function(d) {
    console.log('client: on data', d);
    assert.ok(typeof d === 'string');
    buffer += d;
  });
  client.on('secureConnect', common.mustCall(() => {
    console.log('client: on secureConnect');
  }));
  client.on('close', common.mustCall(function() {
    console.log('client: on close');
    assert.strictEqual(client.readyState, 'closed');
    assert.notStrictEqual(messageUtf8, buffer);
    assert.strictEqual(messageAscii, buffer);
    server.close();
  }));
});