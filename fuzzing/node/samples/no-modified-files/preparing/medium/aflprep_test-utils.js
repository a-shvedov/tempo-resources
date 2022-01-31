'use strict';
self.getterRejects = (t, obj, getterName, target) => {
  const getter = Object.getOwnPropertyDescriptor(obj, getterName).get;
  return promise_rejects_js(t, TypeError, getter.call(target), getterName + ' should reject with a TypeError');
};
self.getterRejectsForAll = (t, obj, getterName, targets) => {
  return Promise.all(targets.map(target => self.getterRejects(t, obj, getterName, target)));
};
self.methodRejects = (t, obj, methodName, target, args) => {
  const method = obj[methodName];
  return promise_rejects_js(t, TypeError, method.apply(target, args),
                         methodName + ' should reject with a TypeError');
};
self.methodRejectsForAll = (t, obj, methodName, targets, args) => {
  return Promise.all(targets.map(target => self.methodRejects(t, obj, methodName, target, args)));
};
self.getterThrows = (obj, getterName, target) => {
  const getter = Object.getOwnPropertyDescriptor(obj, getterName).get;
  assert_throws_js(TypeError, () => getter.call(target), getterName + ' should throw a TypeError');
};
self.getterThrowsForAll = (obj, getterName, targets) => {
  targets.forEach(target => self.getterThrows(obj, getterName, target));
};
self.methodThrows = (obj, methodName, target, args) => {
  const method = obj[methodName];
  assert_equals(typeof method, 'function', methodName + ' should exist');
  assert_throws_js(TypeError, () => method.apply(target, args), methodName + ' should throw a TypeError');
};
self.methodThrowsForAll = (obj, methodName, targets, args) => {
  targets.forEach(target => self.methodThrows(obj, methodName, target, args));
};
self.constructorThrowsForAll = (constructor, firstArgs) => {
  firstArgs.forEach(firstArg => assert_throws_js(TypeError, () => new constructor(firstArg),
                                                 'constructor should throw a TypeError'));
};
self.garbageCollect = () => {
  if (self.gc) {
    self.gc();
  } else if (self.GCController) {
    GCController.collect();
  } else {
    console.warn('Tests are running without the ability to do manual garbage collection. They will still work, but ' +
      'coverage will be suboptimal.');
  }
};
self.delay = ms => new Promise(resolve => step_timeout(resolve, ms));
self.flushAsyncEvents = () => delay(0).then(() => delay(0)).then(() => delay(0)).then(() => delay(0));