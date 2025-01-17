'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustNotCall());
const count = 32;
server.listen(0, common.mustCall(() => {
  client.setMaxListeners(33);
  const countdown = new Countdown(count + 1, () => {
    server.close();
    client.close();
  });
  function doTest(i) {
    const req = client.request({ ':path': `bad${String.fromCharCode(i)}path` });
    req.on('error', common.expectsError({
      code: 'ERR_HTTP2_STREAM_ERROR',
      name: 'Error',
      message: 'Stream closed with error code NGHTTP2_PROTOCOL_ERROR'
    }));
    req.on('close', common.mustCall(() => countdown.dec()));
  }
  for (let i = 0; i <= count; i += 1)
    doTest(i);
}));
