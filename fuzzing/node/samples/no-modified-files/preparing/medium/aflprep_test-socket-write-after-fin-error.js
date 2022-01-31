'use strict';
const assert = require('assert');
const net = require('net');
let serverData = '';
let gotServerEnd = false;
let clientData = '';
let gotClientEnd = false;
let gotServerError = false;
const server = net.createServer(function(sock) {
  sock.setEncoding('utf8');
  sock.on('error', function(er) {
    console.error(`${er.code}: ${er.message}`);
    gotServerError = er;
  });
  sock.on('data', function(c) {
    serverData += c;
  });
  sock.on('end', function() {
    gotServerEnd = true;
    setImmediate(() => {
      sock.write(serverData);
      sock.end();
    });
  });
  server.close();
});
server.listen(0, function() {
  const sock = net.connect(this.address().port);
  sock.setEncoding('utf8');
  sock.on('data', function(c) {
    clientData += c;
  });
  sock.on('end', function() {
    gotClientEnd = true;
  });
  process.on('exit', function() {
    assert.strictEqual(clientData, '');
    assert.strictEqual(serverData, 'hello1hello2hello3\nTHUNDERMUSCLE!');
    assert(gotClientEnd);
    assert(gotServerEnd);
    assert(gotServerError);
    assert.strictEqual(gotServerError.code, 'EPIPE');
    assert.notStrictEqual(gotServerError.message, 'write after end');
    console.log('ok');
  });
  sock.write('hello1');
  sock.write('hello2');
  sock.write('hello3\n');
  sock.end('THUNDERMUSCLE!');
});