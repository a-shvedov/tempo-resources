'use strict';
const assert = require('assert');
const { MessageChannel, moveMessagePortToContext } = require('worker_threads');
function dummy() {}
{
  const { port1, port2 } = new MessageChannel();
  port1.close(common.mustCall(() => {
    port1.on('message', dummy);
    port1.off('message', dummy);
    port2.on('message', dummy);
    port2.off('message', dummy);
  }));
  port1.on('message', dummy);
  port1.off('message', dummy);
  port2.on('message', dummy);
  port2.off('message', dummy);
}
{
  const { port1 } = new MessageChannel();
  port1.on('message', dummy);
  port1.close(common.mustCall(() => {
    port1.off('message', dummy);
  }));
}
{
  const { port2 } = new MessageChannel();
  port2.close();
  assert.throws(() => moveMessagePortToContext(port2, {}), {
    code: 'ERR_CLOSED_MESSAGE_PORT',
    message: 'Cannot send data on closed MessagePort'
  });
}
