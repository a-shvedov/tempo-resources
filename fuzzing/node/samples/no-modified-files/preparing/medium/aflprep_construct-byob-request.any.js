'use strict';
function getRealByteStreamController() {
  let controller;
  new ReadableStream({
    start(c) {
      controller = c;
    },
    type: 'bytes'
  });
  return controller;
}
function createDummyObject(prototype, type, realObjectCreator) {
  switch (type) {
    case 'undefined':
      return undefined;
    case 'null':
      return null;
    case 'fake':
      return Object.create(prototype);
    case 'real':
      return realObjectCreator();
  }
  throw new Error('not reached');
}
const dummyTypes = ['undefined', 'null', 'fake', 'real'];
for (const controllerType of dummyTypes) {
  const controller = createDummyObject(ReadableByteStreamController.prototype, controllerType,
                                        getRealByteStreamController);
  for (const viewType of dummyTypes) {
    const view = createDummyObject(Uint8Array.prototype, viewType, () => new Uint8Array(16));
    test(() => {
      assert_throws_js(TypeError, () => new ReadableStreamBYOBRequest(controller, view),
                        'constructor should throw');
    }, `ReadableStreamBYOBRequest constructor should throw when passed a ${controllerType} ` +
        `ReadableByteStreamController and a ${viewType} view`);
  }
}