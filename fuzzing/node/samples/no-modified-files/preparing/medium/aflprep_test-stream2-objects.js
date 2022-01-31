'use strict';
const { Readable, Writable } = require('stream');
const assert = require('assert');
function toArray(callback) {
  const stream = new Writable({ objectMode: true });
  const list = [];
  stream.write = function(chunk) {
    list.push(chunk);
  };
  stream.end = common.mustCall(function() {
    callback(list);
  });
  return stream;
}
function fromArray(list) {
  const r = new Readable({ objectMode: true });
  r._read = common.mustNotCall();
  list.forEach(function(chunk) {
    r.push(chunk);
  });
  r.push(null);
  return r;
}
{
  const r = fromArray([{ one: '1' }, { two: '2' }]);
  const v1 = r.read();
  const v2 = r.read();
  const v3 = r.read();
  assert.deepStrictEqual(v1, { one: '1' });
  assert.deepStrictEqual(v2, { two: '2' });
  assert.deepStrictEqual(v3, null);
}
{
  const r = fromArray([{ one: '1' }, { two: '2' }]);
  r.pipe(toArray(common.mustCall(function(list) {
    assert.deepStrictEqual(list, [
      { one: '1' },
      { two: '2' },
    ]);
  })));
}
{
  const r = fromArray([{ one: '1' }, { two: '2' }]);
  const value = r.read(2);
  assert.deepStrictEqual(value, { one: '1' });
}
{
  const r = new Readable({ objectMode: true });
  const list = [{ one: '1' }, { two: '2' }];
  r._read = function(n) {
    const item = list.shift();
    r.push(item || null);
  };
  r.pipe(toArray(common.mustCall(function(list) {
    assert.deepStrictEqual(list, [
      { one: '1' },
      { two: '2' },
    ]);
  })));
}
{
  const r = new Readable({ objectMode: true });
  const list = [{ one: '1' }, { two: '2' }];
  r._read = function(n) {
    const item = list.shift();
    process.nextTick(function() {
      r.push(item || null);
    });
  };
  r.pipe(toArray(common.mustCall(function(list) {
    assert.deepStrictEqual(list, [
      { one: '1' },
      { two: '2' },
    ]);
  })));
}
{
  const r = new Readable({
    objectMode: true
  });
  r._read = common.mustNotCall();
  const list = ['one', 'two', 'three'];
  list.forEach(function(str) {
    r.push(str);
  });
  r.push(null);
  r.pipe(toArray(common.mustCall(function(array) {
    assert.deepStrictEqual(array, list);
  })));
}
{
  const r = new Readable({
    objectMode: true
  });
  r._read = common.mustNotCall();
  r.push('foobar');
  r.push(null);
  r.pipe(toArray(common.mustCall(function(array) {
    assert.deepStrictEqual(array, ['foobar']);
  })));
}
{
  const r = new Readable({
    objectMode: true
  });
  r._read = common.mustNotCall();
  r.push(false);
  r.push(0);
  r.push('');
  r.push(null);
  r.pipe(toArray(common.mustCall(function(array) {
    assert.deepStrictEqual(array, [false, 0, '']);
  })));
}
{
  const r = new Readable({
    highWaterMark: 6,
    objectMode: true
  });
  let calls = 0;
  const list = ['1', '2', '3', '4', '5', '6', '7', '8'];
  r._read = function(n) {
    calls++;
  };
  list.forEach(function(c) {
    r.push(c);
  });
  const v = r.read();
  assert.strictEqual(calls, 0);
  assert.strictEqual(v, '1');
  const v2 = r.read();
  assert.strictEqual(v2, '2');
  const v3 = r.read();
  assert.strictEqual(v3, '3');
  assert.strictEqual(calls, 1);
}
{
  const r = new Readable({
    highWaterMark: 6,
    objectMode: true
  });
  r._read = common.mustNotCall();
  for (let i = 0; i < 6; i++) {
    const bool = r.push(i);
    assert.strictEqual(bool, i !== 5);
  }
}
{
  const w = new Writable({ objectMode: true });
  w._write = function(chunk, encoding, cb) {
    assert.deepStrictEqual(chunk, { foo: 'bar' });
    cb();
  };
  w.on('finish', common.mustCall());
  w.write({ foo: 'bar' });
  w.end();
}
{
  const w = new Writable({ objectMode: true });
  const list = [];
  w._write = function(chunk, encoding, cb) {
    list.push(chunk);
    cb();
  };
  w.on('finish', common.mustCall(function() {
    assert.deepStrictEqual(list, [0, 1, 2, 3, 4]);
  }));
  w.write(0);
  w.write(1);
  w.write(2);
  w.write(3);
  w.write(4);
  w.end();
}
{
  const w = new Writable({
    objectMode: true
  });
  const list = [];
  w._write = function(chunk, encoding, cb) {
    list.push(chunk);
    process.nextTick(cb);
  };
  w.on('finish', common.mustCall(function() {
    assert.deepStrictEqual(list, ['0', '1', '2', '3', '4']);
  }));
  w.write('0');
  w.write('1');
  w.write('2');
  w.write('3');
  w.write('4');
  w.end();
}
{
  const w = new Writable({
    objectMode: true
  });
  let called = false;
  w._write = function(chunk, encoding, cb) {
    assert.strictEqual(chunk, 'foo');
    process.nextTick(function() {
      called = true;
      cb();
    });
  };
  w.on('finish', common.mustCall(function() {
    assert.strictEqual(called, true);
  }));
  w.write('foo');
  w.end();
}