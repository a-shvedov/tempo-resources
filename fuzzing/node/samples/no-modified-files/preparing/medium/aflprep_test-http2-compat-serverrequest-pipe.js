'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const loc = fixtures.path('person-large.jpg');
const fn = path.join(tmpdir.path, 'http2-url-tests.js');
const server = http2.createServer();
server.on('request', common.mustCall((req, res) => {
  const dest = req.pipe(fs.createWriteStream(fn));
  dest.on('finish', common.mustCall(() => {
    assert.strictEqual(req.complete, true);
    assert.strictEqual(fs.readFileSync(loc).length, fs.readFileSync(fn).length);
    fs.unlinkSync(fn);
    res.end();
  }));
}));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  let remaining = 2;
  function maybeClose() {
    if (--remaining === 0) {
      server.close();
      client.close();
    }
  }
  const req = client.request({ ':method': 'POST' });
  req.on('response', common.mustCall());
  req.resume();
  req.on('end', common.mustCall(maybeClose));
  const str = fs.createReadStream(loc);
  str.on('end', common.mustCall(maybeClose));
  str.pipe(req);
}));