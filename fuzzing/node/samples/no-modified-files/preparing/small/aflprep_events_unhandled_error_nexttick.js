'use strict';
const EventEmitter = require('events');
const er = new Error();
process.nextTick(() => {
  new EventEmitter().emit('error', er);
});
