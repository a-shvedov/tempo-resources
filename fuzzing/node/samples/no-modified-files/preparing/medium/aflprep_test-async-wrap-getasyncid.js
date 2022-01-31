'use strict';
const assert = require('assert');
const fs = require('fs');
const v8 = require('v8');
const fsPromises = fs.promises;
const net = require('net');
const providers = { ...internalBinding('async_wrap').Providers };
const { getSystemErrorName } = require('util');
{
  const hooks = require('async_hooks').createHook({
    init(id, type) {
      if (type === 'NONE')
        throw new Error('received a provider type of NONE');
      delete providers[type];
    },
  }).enable();
  process.on('beforeExit', common.mustCall(() => {
    global.gc();
    process.removeAllListeners('uncaughtException');
    hooks.disable();
    delete providers.TTYWRAP;
    delete providers.HTTP2SESSION;
    delete providers.HTTP2STREAM;
    delete providers.HTTP2PING;
    delete providers.HTTP2SETTINGS;
    delete providers.STREAMPIPE;
    delete providers.MESSAGEPORT;
    delete providers.WORKER;
    delete providers.JSUDPWRAP;
    if (!common.isMainThread)
      delete providers.INSPECTORJSBINDING;
    delete providers.KEYPAIRGENREQUEST;
    delete providers.KEYGENREQUEST;
    delete providers.KEYEXPORTREQUEST;
    delete providers.CIPHERREQUEST;
    delete providers.DERIVEBITSREQUEST;
    delete providers.SCRYPTREQUEST;
    delete providers.SIGNREQUEST;
    delete providers.VERIFYREQUEST;
    delete providers.HASHREQUEST;
    delete providers.HTTPCLIENTREQUEST;
    delete providers.HTTPINCOMINGMESSAGE;
    delete providers.ELDHISTOGRAM;
    delete providers.SIGINTWATCHDOG;
    delete providers.WORKERHEAPSNAPSHOT;
    delete providers.FIXEDSIZEBLOBCOPY;
    delete providers.RANDOMPRIMEREQUEST;
    delete providers.CHECKPRIMEREQUEST;
    const objKeys = Object.keys(providers);
    if (objKeys.length > 0)
      process._rawDebug(objKeys);
    assert.strictEqual(objKeys.length, 0);
  }));
}
function testUninitialized(req, ctor_name) {
  assert.strictEqual(typeof req.getAsyncId, 'function');
  assert.strictEqual(req.getAsyncId(), -1);
  assert.strictEqual(req.constructor.name, ctor_name);
}
function testInitialized(req, ctor_name) {
  assert.strictEqual(typeof req.getAsyncId, 'function');
  assert(Number.isSafeInteger(req.getAsyncId()));
  assert(req.getAsyncId() > 0);
  assert.strictEqual(req.constructor.name, ctor_name);
}
{
  const cares = internalBinding('cares_wrap');
  const dns = require('dns');
  testUninitialized(new cares.GetAddrInfoReqWrap(), 'GetAddrInfoReqWrap');
  testUninitialized(new cares.GetNameInfoReqWrap(), 'GetNameInfoReqWrap');
  testUninitialized(new cares.QueryReqWrap(), 'QueryReqWrap');
  testInitialized(dns.lookup('www.google.com', () => {}), 'GetAddrInfoReqWrap');
  testInitialized(dns.lookupService('::1', 22, () => {}), 'GetNameInfoReqWrap');
  const resolver = new dns.Resolver();
  resolver.setServers(['127.0.0.1']);
  testInitialized(resolver._handle, 'ChannelWrap');
  testInitialized(resolver.resolve6('::1', () => {}), 'QueryReqWrap');
  resolver.cancel();
}
{
  const FSEvent = internalBinding('fs_event_wrap').FSEvent;
  testInitialized(new FSEvent(), 'FSEvent');
}
{
  const JSStream = internalBinding('js_stream').JSStream;
  testInitialized(new JSStream(), 'JSStream');
}
{
  new Promise((res) => res(5));
}
  const crypto = require('crypto');
  const mc = common.mustCall(function pb() {
    testInitialized(this, 'PBKDF2Job');
  });
  crypto.pbkdf2('password', 'salt', 1, 20, 'sha256', mc);
  crypto.randomBytes(1, common.mustCall(function rb() {
    testInitialized(this, 'RandomBytesJob');
  }));
  if (typeof internalBinding('crypto').ScryptJob === 'function') {
    crypto.scrypt('password', 'salt', 8, common.mustCall(function() {
      testInitialized(this, 'ScryptJob');
    }));
  }
}
{
  const binding = internalBinding('fs');
  const path = require('path');
  const FSReqCallback = binding.FSReqCallback;
  const req = new FSReqCallback();
  req.oncomplete = () => { };
  testInitialized(req, 'FSReqCallback');
  const StatWatcher = binding.StatWatcher;
  testInitialized(new StatWatcher(), 'StatWatcher');
}
{
  const { HTTPParser } = require('_http_common');
  const parser = new HTTPParser();
  testUninitialized(parser, 'HTTPParser');
  parser.initialize(HTTPParser.REQUEST, {});
  testInitialized(parser, 'HTTPParser');
}
{
  const Gzip = require('zlib').Gzip;
  testInitialized(new Gzip()._handle, 'Zlib');
}
{
  const binding = internalBinding('pipe_wrap');
  const handle = new binding.Pipe(binding.constants.IPC);
  testInitialized(handle, 'Pipe');
}
{
  tmpdir.refresh();
  const server = net.createServer(common.mustCall((socket) => {
    server.close();
  })).listen(common.PIPE, common.mustCall(() => {
    const binding = internalBinding('pipe_wrap');
    const handle = new binding.Pipe(binding.constants.SOCKET);
    testInitialized(handle, 'Pipe');
    const req = new binding.PipeConnectWrap();
    testUninitialized(req, 'PipeConnectWrap');
    req.address = common.PIPE;
    req.oncomplete = common.mustCall(() => handle.close());
    handle.connect(req, req.address, req.oncomplete);
    testInitialized(req, 'PipeConnectWrap');
  }));
}
{
  const Process = internalBinding('process_wrap').Process;
  testInitialized(new Process(), 'Process');
}
{
  const { Signal } = internalBinding('signal_wrap');
  testInitialized(new Signal(), 'Signal');
}
{
  async function openTest() {
    const fd = await fsPromises.open(__filename, 'r');
    testInitialized(fd, 'FileHandle');
    await fd.close();
  }
  openTest().then(common.mustCall());
}
{
  const binding = internalBinding('stream_wrap');
  testUninitialized(new binding.WriteWrap(), 'WriteWrap');
}
{
  const stream_wrap = internalBinding('stream_wrap');
  const tcp_wrap = internalBinding('tcp_wrap');
  const server = net.createServer(common.mustCall((socket) => {
    server.close();
    socket.on('data', () => {
      socket.end();
      socket.destroy();
    });
    socket.resume();
  })).listen(0, common.localhostIPv4, common.mustCall(() => {
    const handle = new tcp_wrap.TCP(tcp_wrap.constants.SOCKET);
    const req = new tcp_wrap.TCPConnectWrap();
    const sreq = new stream_wrap.ShutdownWrap();
    testInitialized(handle, 'TCP');
    testUninitialized(req, 'TCPConnectWrap');
    testUninitialized(sreq, 'ShutdownWrap');
    sreq.oncomplete = common.mustCall(() => {
      handle.close();
    });
    req.oncomplete = common.mustCall(writeData);
    function writeData() {
      const wreq = new stream_wrap.WriteWrap();
      wreq.handle = handle;
      wreq.oncomplete = () => {
        handle.shutdown(sreq);
        testInitialized(sreq, 'ShutdownWrap');
      };
      const err = handle.writeLatin1String(wreq, 'hi'.repeat(100000));
      if (err)
        throw new Error(`write failed: ${getSystemErrorName(err)}`);
      if (!stream_wrap.streamBaseState[stream_wrap.kLastWriteWasAsync]) {
        testUninitialized(wreq, 'WriteWrap');
        return writeData();
      }
      testInitialized(wreq, 'WriteWrap');
    }
    req.address = common.localhostIPv4;
    req.port = server.address().port;
    const err = handle.connect(req, req.address, req.port);
    assert.strictEqual(err, 0);
    testInitialized(req, 'TCPConnectWrap');
  }));
}
  const { TCP, constants: TCPConstants } = internalBinding('tcp_wrap');
  const tcp = new TCP(TCPConstants.SOCKET);
  const ca = fixtures.readKey('rsa_ca.crt');
  const cert = fixtures.readKey('rsa_cert.crt');
  const key = fixtures.readKey('rsa_private.pem');
  const credentials = require('tls').createSecureContext({ ca, cert, key });
  const tls_wrap = internalBinding('tls_wrap');
  testInitialized(tls_wrap.wrap(tcp, credentials.context, true), 'TLSWrap');
}
{
  const binding = internalBinding('udp_wrap');
  const handle = new binding.UDP();
  const req = new binding.SendWrap();
  testInitialized(handle, 'UDP');
  testUninitialized(req, 'SendWrap');
  handle.bind('0.0.0.0', 0, undefined);
  const addr = {};
  handle.getsockname(addr);
  req.address = '127.0.0.1';
  req.port = addr.port;
  req.oncomplete = () => handle.close();
  handle.send(req, [Buffer.alloc(1)], 1, req.port, req.address, true);
  testInitialized(req, 'SendWrap');
}
if (process.features.inspector && common.isMainThread) {
  const binding = internalBinding('inspector');
  const handle = new binding.Connection(() => {});
  testInitialized(handle, 'Connection');
  handle.disconnect();
}
{
  v8.getHeapSnapshot().destroy();
}
{
  const dirBinding = internalBinding('fs_dir');
  testInitialized(handle, 'DirHandle');
}