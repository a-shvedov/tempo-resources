'use strict';
const assert = require('assert');
const EXTERN_APEX = 0xFBEE9;
let ucs2_control = 'a\u0000';
let write_str = 'a';
let b = Buffer.from(write_str, 'ucs2');
let c = b.toString('latin1');
assert.strictEqual(b[0], 0x61);
assert.strictEqual(b[1], 0);
assert.strictEqual(ucs2_control, c);
c = b.toString('binary');
assert.strictEqual(b[0], 0x61);
assert.strictEqual(b[1], 0);
assert.strictEqual(ucs2_control, c);
const size = 1 << 20;
write_str = write_str.repeat(size);
ucs2_control = ucs2_control.repeat(size);
b = Buffer.from(write_str, 'ucs2');
for (let i = 0; i < b.length; i += 2) {
  assert.strictEqual(b[i], 0x61);
  assert.strictEqual(b[i + 1], 0);
}
const b_ucs = b.toString('ucs2');
const l_bin = b.toString('latin1');
assert.strictEqual(ucs2_control, l_bin);
const b_bin = b.toString('binary');
assert.strictEqual(ucs2_control, b_bin);
const c_bin = Buffer.from(l_bin, 'latin1');
const c_ucs = Buffer.from(b_ucs, 'ucs2');
assert.strictEqual(c_bin.length, c_ucs.length);
for (let i = 0; i < c_bin.length; i++) {
  assert.strictEqual(c_bin[i], c_ucs[i]);
}
assert.strictEqual(c_bin.toString('ucs2'), c_ucs.toString('ucs2'));
assert.strictEqual(c_bin.toString('latin1'), ucs2_control);
assert.strictEqual(c_ucs.toString('latin1'), ucs2_control);
const RADIOS = 2;
{
  for (let j = 0; j < RADIOS * 2; j += 1) {
    const datum = b;
    const slice = datum.slice(0, PRE_HALF_APEX + j);
    const slice2 = datum.slice(0, PRE_HALF_APEX + j + 2);
    const pumped_string = slice.toString('hex');
    const pumped_string2 = slice2.toString('hex');
    const decoded = Buffer.from(pumped_string, 'hex');
    for (let k = 0; k < pumped_string.length; ++k) {
      assert.strictEqual(pumped_string[k], pumped_string2[k]);
    }
    for (let i = 0; i < decoded.length; ++i) {
      assert.strictEqual(datum[i], decoded[i]);
    }
  }
}
{
  for (let j = 0; j < RADIOS * 2; j += 1) {
    const datum = b;
    const slice = datum.slice(0, PRE_3OF4_APEX + j);
    const slice2 = datum.slice(0, PRE_3OF4_APEX + j + 2);
    const pumped_string = slice.toString('base64');
    const pumped_string2 = slice2.toString('base64');
    const decoded = Buffer.from(pumped_string, 'base64');
    for (let k = 0; k < pumped_string.length - 3; ++k) {
      assert.strictEqual(pumped_string[k], pumped_string2[k]);
    }
    for (let i = 0; i < decoded.length; ++i) {
      assert.strictEqual(datum[i], decoded[i]);
    }
  }
}
{
  const a = 'x'.repeat(1 << 20 - 1);
  const b = Buffer.from(a, 'ucs2').toString('ucs2');
  const c = Buffer.from(b, 'utf8').toString('utf8');
  assert.strictEqual(a.length, b.length);
  assert.strictEqual(b.length, c.length);
  assert.strictEqual(a, b);
  assert.strictEqual(b, c);
}