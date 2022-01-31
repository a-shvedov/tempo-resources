'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
process.on('exit', global.gc);
{
  const { clientSide, serverSide } = makeDuplexPair();
  let serverSideHttp2Stream;
  let serverSideHttp2StreamDestroyed = false;
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream, headers) => {
    serverSideHttp2Stream = stream;
    stream.respond({
      ':status': 200
    });
    const originalWrite = serverSide._write;
    serverSide._write = (buf, enc, cb) => {
      if (serverSideHttp2StreamDestroyed) {
        serverSide.destroy();
        serverSide.write = () => {};
      } else {
        setImmediate(() => {
          originalWrite.call(serverSide, buf, enc, () => setImmediate(cb));
        });
      }
    };
    stream.write(Buffer.alloc(40000));
  }));
  server.emit('connection', serverSide);
    createConnection: common.mustCall(() => clientSide)
  });
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(headers[':status'], 200);
  }));
  req.on('data', common.mustCallAtLeast(() => {
    if (!serverSideHttp2StreamDestroyed) {
      serverSideHttp2Stream.destroy();
      serverSideHttp2StreamDestroyed = true;
    }
  }));
}