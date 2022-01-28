'use strict';
const { TTY } = internalBinding('tty_wrap');
const { WriteWrap } = internalBinding('stream_wrap');
const handle = new TTY(1);
const req = new WriteWrap();
handle.writeBuffer(req, Buffer.from('hello world 1\n'));
handle.writeBuffer(req, Buffer.from('hello world 2\n'));
