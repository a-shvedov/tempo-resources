'use strict';
const assert = require('assert');
const READSIZE = 100;
const PUSHSIZE = 20;
const PUSHCOUNT = 1000;
const HWM = 50;
const Readable = require('stream').Readable;
const r = new Readable({
  highWaterMark: HWM
});
const rs = r._readableState;
r._read = push;
r.on('readable', function() {
  console.error('>> readable');
  let ret;
  do {
    console.error(`  > read(${READSIZE})`);
    ret = r.read(READSIZE);
    console.error(`  < ${ret && ret.length} (${rs.length} remain)`);
  } while (ret && ret.length === READSIZE);
  console.error('<< after read()',
                ret && ret.length,
                rs.needReadable,
                rs.length);
});
r.on('end', common.mustCall(function() {
  assert.strictEqual(pushes, PUSHCOUNT + 1);
}));
let pushes = 0;
function push() {
  if (pushes > PUSHCOUNT)
    return;
  if (pushes++ === PUSHCOUNT) {
    console.error('   push(EOF)');
    return r.push(null);
  }
  console.error(`   push #${pushes}`);
  if (r.push(Buffer.allocUnsafe(PUSHSIZE)))
    setTimeout(push, 1);
}