'use strict';
const assert = require('assert');
const http = require('http');
const Duplex = require('stream').Duplex;
class FakeAgent extends http.Agent {
  createConnection() {
    const s = new Duplex();
    let once = false;
    s._read = function() {
      if (once)
        return this.push(null);
      once = true;
      this.push('b\r\nhello world\r\n');
      this.readable = false;
      this.push('0\r\n\r\n');
    };
    s._write = function(data, enc, cb) {
      cb();
    };
    s.destroy = s.destroySoon = function() {
      this.writable = false;
    };
    return s;
  }
}
let received = '';
const req = http.request({
  agent: new FakeAgent()
}, common.mustCall(function requestCallback(res) {
  res.on('data', function dataCallback(chunk) {
    received += chunk;
  });
  res.on('end', common.mustCall(function endCallback() {
    assert.strictEqual(received, 'hello world');
  }));
}));
req.end();
