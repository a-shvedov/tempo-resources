'use strict';
const assert = require('assert');
const {
  ReadableStream,
  ReadableByteStreamController,
  ReadableStreamDefaultReader,
  ReadableStreamBYOBReader,
  ReadableStreamBYOBRequest,
const {
  kState,
const {
  open,
const {
  readFileSync,
} = require('fs');
const {
  Buffer,
} = require('buffer');
const {
  inspect,
} = require('util');
{
  const r = new ReadableStream({
    type: 'bytes',
  });
  assert(r[kState].controller instanceof ReadableByteStreamController);
  assert.strictEqual(typeof r.locked, 'boolean');
  assert.strictEqual(typeof r.cancel, 'function');
  assert.strictEqual(typeof r.getReader, 'function');
  assert.strictEqual(typeof r.pipeThrough, 'function');
  assert.strictEqual(typeof r.pipeTo, 'function');
  assert.strictEqual(typeof r.tee, 'function');
  ['', null, 'asdf'].forEach((mode) => {
    assert.throws(() => r.getReader({ mode }), {
      code: 'ERR_INVALID_ARG_VALUE',
    });
  });
  [1, 'asdf'].forEach((options) => {
    assert.throws(() => r.getReader(options), {
      code: 'ERR_INVALID_ARG_TYPE',
    });
  });
  assert(!r.locked);
  const defaultReader = r.getReader();
  assert(r.locked);
  assert(defaultReader instanceof ReadableStreamDefaultReader);
  defaultReader.releaseLock();
  const byobReader = r.getReader({ mode: 'byob' });
  assert(byobReader instanceof ReadableStreamBYOBReader);
}
class Source {
  constructor() {
    this.controllerClosed = false;
  }
  async start(controller) {
    this.file = await open(__filename);
    this.controller = controller;
  }
  async pull(controller) {
    const byobRequest = controller.byobRequest;
    const view = byobRequest.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength
    });
    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    assert.throws(() => byobRequest.respondWithNewView({}), {
      code: 'ERR_INVALID_ARG_TYPE',
    });
    byobRequest.respond(bytesRead);
    assert.throws(() => byobRequest.respond(bytesRead), {
      code: 'ERR_INVALID_STATE',
    });
    assert.throws(() => byobRequest.respondWithNewView(view), {
      code: 'ERR_INVALID_STATE',
    });
  }
  get type() { return 'bytes'; }
  get autoAllocateChunkSize() { return 1024; }
}
{
  const stream = new ReadableStream(new Source());
  assert(stream[kState].controller instanceof ReadableByteStreamController);
  async function read(stream) {
    const reader = stream.getReader({ mode: 'byob' });
    const chunks = [];
    let result;
    do {
      result = await reader.read(Buffer.alloc(100));
      if (result.value !== undefined)
        chunks.push(Buffer.from(result.value));
    } while (!result.done);
    return Buffer.concat(chunks);
  }
  read(stream).then(common.mustCall((data) => {
    const check = readFileSync(__filename);
    assert.deepStrictEqual(check, data);
  }));
}
{
  const stream = new ReadableStream(new Source());
  assert(stream[kState].controller instanceof ReadableByteStreamController);
  async function read(stream) {
    const chunks = [];
    for await (const chunk of stream)
      chunks.push(chunk);
    return Buffer.concat(chunks);
  }
  read(stream).then(common.mustCall((data) => {
    const check = readFileSync(__filename);
    assert.deepStrictEqual(check, data);
  }));
}
{
  const stream = new ReadableStream(new Source());
  assert(stream[kState].controller instanceof ReadableByteStreamController);
  async function read(stream) {
    for await (const _ of stream)
      break;
  }
  read(stream).then(common.mustCall());
}
{
  const stream = new ReadableStream(new Source());
  assert(stream[kState].controller instanceof ReadableByteStreamController);
  const error = new Error('boom');
  async function read(stream) {
    for await (const _ of stream)
      throw error;
  }
  assert.rejects(read(stream), error);
}
{
  assert.throws(() => {
    Reflect.get(ReadableStreamBYOBRequest.prototype, 'view', {});
  }, {
    code: 'ERR_INVALID_THIS',
  });
  assert.throws(() => ReadableStreamBYOBRequest.prototype.respond.call({}), {
    code: 'ERR_INVALID_THIS',
  });
  assert.throws(() => {
    ReadableStreamBYOBRequest.prototype.respondWithNewView.call({});
  }, {
    code: 'ERR_INVALID_THIS',
  });
}
{
  const readable = new ReadableStream({ type: 'bytes' });
  const reader = readable.getReader({ mode: 'byob' });
  reader.releaseLock();
  reader.releaseLock();
  assert.rejects(reader.read(new Uint8Array(10)), {
    code: 'ERR_INVALID_STATE',
  });
  assert.rejects(reader.cancel(), {
    code: 'ERR_INVALID_STATE',
  });
}
{
  let controller;
  new ReadableStream({
    type: 'bytes',
    start(c) { controller = c; }
  });
  assert.throws(() => controller.enqueue(1), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
  controller.close();
  assert.throws(() => controller.enqueue(new Uint8Array(10)), {
    code: 'ERR_INVALID_STATE',
  });
  assert.throws(() => controller.close(), {
    code: 'ERR_INVALID_STATE',
  });
}
{
}