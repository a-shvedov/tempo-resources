'use strict';
const assert = require('assert');
const net = require('net');
let connections = 0;
let dataEvents = 0;
let conn;
const server = net.createServer(function(conn) {
  connections++;
  conn.end('This was the year he fell to pieces.');
  if (connections === 5)
    server.close();
});
server.listen(0, function() {
  conn = net.createConnection(this.address().port, 'localhost');
  conn.resume();
  conn.on('data', onDataOk);
  conn = net.createConnection(this.address().port, 'localhost');
  conn.pause();
  conn.resume();
  conn.on('data', onDataOk);
  conn = net.createConnection(this.address().port, 'localhost');
  conn.pause();
  conn.on('data', common.mustNotCall());
  scheduleTearDown(conn);
  conn = net.createConnection(this.address().port, 'localhost');
  conn.resume();
  conn.pause();
  conn.resume();
  conn.on('data', onDataOk);
  conn = net.createConnection(this.address().port, 'localhost');
  conn.resume();
  conn.resume();
  conn.pause();
  conn.on('data', common.mustNotCall());
  scheduleTearDown(conn);
  function onDataOk() {
    dataEvents++;
  }
  function scheduleTearDown(conn) {
    setTimeout(function() {
      conn.removeAllListeners('data');
      conn.resume();
    }, 100);
  }
});
process.on('exit', function() {
  assert.strictEqual(connections, 5);
  assert.strictEqual(dataEvents, 3);
});