'use strict';
const assert = require('assert');
const net = require('net');
const connections = [];
const received = [];
const sent = [];
function createConnection(index) {
  console.error(`creating connection ${index}`);
  return new Promise(function(resolve, reject) {
    const connection = net.createConnection(server.address().port, function() {
      const msg = String(index);
      console.error(`sending message: ${msg}`);
      this.write(msg);
      sent.push(msg);
    });
    connection.on('error', function(err) {
      assert.strictEqual(err.code, 'ECONNRESET');
      resolve();
    });
    connection.on('data', function(e) {
      console.error(`connection ${index} received response`);
      resolve();
    });
    connection.on('end', function() {
      console.error(`ending ${index}`);
      resolve();
    });
    connections[index] = connection;
  });
}
function closeConnection(index) {
  console.error(`closing connection ${index}`);
  return new Promise(function(resolve, reject) {
    connections[index].on('end', function() {
      resolve();
    });
    connections[index].end();
  });
}
const server = net.createServer(function(socket) {
  socket.on('data', function(data) {
    console.error(`received message: ${data}`);
    received.push(String(data));
    socket.write('acknowledged');
  });
});
server.maxConnections = 1;
server.listen(0, function() {
  createConnection(0)
    .then(createConnection.bind(null, 1))
    .then(closeConnection.bind(null, 0))
    .then(createConnection.bind(null, 2))
    .then(createConnection.bind(null, 3))
    .then(server.close.bind(server))
    .then(closeConnection.bind(null, 2));
});
process.on('exit', function() {
  assert.deepStrictEqual(sent, ['0', '1', '2', '3']);
  assert.deepStrictEqual(received, ['0', '2']);
});