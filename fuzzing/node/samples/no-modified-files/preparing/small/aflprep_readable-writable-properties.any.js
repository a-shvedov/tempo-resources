'use strict';
test(() => {
  const te = new TextEncoderStream();
  assert_equals(typeof ReadableStream.prototype.getReader.call(te.readable),
                'object', 'readable property must pass brand check');
  assert_equals(typeof WritableStream.prototype.getWriter.call(te.writable),
                'object', 'writable property must pass brand check');
}, 'TextEncoderStream readable and writable properties must pass brand checks');
test(() => {
  const td = new TextDecoderStream();
  assert_equals(typeof ReadableStream.prototype.getReader.call(td.readable),
                'object', 'readable property must pass brand check');
  assert_equals(typeof WritableStream.prototype.getWriter.call(td.writable),
                'object', 'writable property must pass brand check');
}, 'TextDecoderStream readable and writable properties must pass brand checks');
