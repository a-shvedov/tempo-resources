'use strict';
const assert = require('assert');
const http = require('http');
const expect = 'hex\nutf8\n';
http.createServer(function(q, s) {
  s.setHeader('content-length', expect.length);
  s.write('6865780a', 'hex');
  s.write('utf8\n');
  s.end();
  this.close();
}).listen(0, common.mustCall(function() {
  http.request({ port: this.address().port })
    .on('response', common.mustCall(function(res) {
      let data = '';
      res.setEncoding('ascii');
      res.on('data', function(c) {
        data += c;
      });
      res.on('end', common.mustCall(function() {
        assert.strictEqual(data, expect);
      }));
    })).end();
}));
