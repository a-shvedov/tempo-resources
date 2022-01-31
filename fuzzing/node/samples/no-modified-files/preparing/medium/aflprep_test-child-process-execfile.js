'use strict';
const assert = require('assert');
const execFile = require('child_process').execFile;
const { getEventListeners } = require('events');
const { getSystemErrorName } = require('util');
const fixture = fixtures.path('exit.js');
const echoFixture = fixtures.path('echo.js');
const execOpts = { encoding: 'utf8', shell: true };
{
  execFile(
    process.execPath,
    [fixture, 42],
    common.mustCall((e) => {
      assert.strictEqual(e.message.trim(),
                         `Command failed: ${process.execPath} ${fixture} 42`);
      assert.strictEqual(e.code, 42);
    })
  );
}
{
  const errorString = `Error: Command failed: ${process.execPath}`;
  const code = -1;
  const callback = common.mustCall((err, stdout, stderr) => {
    assert.strictEqual(err.toString().trim(), errorString);
    assert.strictEqual(err.code, getSystemErrorName(code));
    assert.strictEqual(err.killed, true);
    assert.strictEqual(err.signal, null);
    assert.strictEqual(err.cmd, process.execPath);
    assert.strictEqual(stdout.trim(), '');
    assert.strictEqual(stderr.trim(), '');
  });
  const child = execFile(process.execPath, callback);
  child.kill();
  child.emit('close', code, null);
}
{
  execFile(process.execPath, [fixture, 0], execOpts, common.mustSucceed());
}
{
  const ac = new AbortController();
  const { signal } = ac;
  const test = () => {
    const check = common.mustCall((err) => {
      assert.strictEqual(err.code, 'ABORT_ERR');
      assert.strictEqual(err.name, 'AbortError');
      assert.strictEqual(err.signal, undefined);
    });
    execFile(process.execPath, [echoFixture, 0], { signal }, check);
  };
  test();
  ac.abort();
}
{
  const signal = AbortSignal.abort();
  const check = common.mustCall((err) => {
    assert.strictEqual(err.code, 'ABORT_ERR');
    assert.strictEqual(err.name, 'AbortError');
    assert.strictEqual(err.signal, undefined);
  });
  execFile(process.execPath, [echoFixture, 0], { signal }, check);
}
{
  assert.throws(() => {
    const callback = common.mustNotCall(() => {});
    execFile(process.execPath, [echoFixture, 0], { signal: 'hello' }, callback);
  }, { code: 'ERR_INVALID_ARG_TYPE', name: 'TypeError' });
}
{
  const ac = new AbortController();
  const { signal } = ac;
  const callback = common.mustCall((err) => {
    assert.strictEqual(getEventListeners(ac.signal).length, 0);
    assert.strictEqual(err, null);
  });
  execFile(process.execPath, [fixture, 0], { signal }, callback);
}