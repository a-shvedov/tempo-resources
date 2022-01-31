'use strict';
if (common.isWindows)
  common.skip('Does not support binding fd on Windows');
const assert = require('assert');
const dgram = require('dgram');
const { UDP } = internalBinding('udp_wrap');
const { TCP, constants } = internalBinding('tcp_wrap');
const _createSocketHandle = dgram._createSocketHandle;
{
  const err = _createSocketHandle(common.localhostIPv4, 0, 'udp4', 42);
  assert(err < 0);
}
{
  const rawHandle = new UDP();
  const err = rawHandle.bind(common.localhostIPv4, 0, 0);
  assert(err >= 0, String(err));
  assert.notStrictEqual(rawHandle.fd, -1);
  const handle = _createSocketHandle(null, 0, 'udp4', rawHandle.fd);
  assert(handle instanceof UDP);
  assert.strictEqual(typeof handle.fd, 'number');
  assert(handle.fd > 0);
}
{
  const rawHandle = new TCP(constants.SOCKET);
  const err = rawHandle.listen();
  assert(err >= 0, String(err));
  assert.notStrictEqual(rawHandle.fd, -1);
  const handle = _createSocketHandle(null, 0, 'udp4', rawHandle.fd);
  assert(handle < 0);
  rawHandle.close();
}