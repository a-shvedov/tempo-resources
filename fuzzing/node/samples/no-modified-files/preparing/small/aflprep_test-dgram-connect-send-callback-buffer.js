'use strict';
const assert = require('assert');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const buf = Buffer.allocUnsafe(256);
const onMessage = common.mustSucceed((bytes) => {
  assert.strictEqual(bytes, buf.length);
  client.close();
});
client.bind(0, common.mustCall(() => {
  client.connect(client.address().port, common.mustCall(() => {
    client.send(buf, onMessage);
  }));
}));
