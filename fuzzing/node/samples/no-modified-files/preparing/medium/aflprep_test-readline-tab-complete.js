'use strict';
const readline = require('readline');
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
common.skipIfDumbTerminal();
[
  'あ',
  '𐐷',
  '🐕',
].forEach((char) => {
  [true, false].forEach((lineBreak) => {
    const completer = (line) => [
      [
        'First group',
        '',
        `${char}${'a'.repeat(10)}`, `${char}${'b'.repeat(10)}`, char.repeat(11),
      ],
      line,
    ];
    let output = '';
    const width = getStringWidth(char) - 1;
    class FakeInput extends EventEmitter {
      columns = ((width + 1) * 10 + (lineBreak ? 0 : 10)) * 3
      write = common.mustCall((data) => {
        output += data;
      }, 6)
      resume() {}
      pause() {}
      end() {}
    }
    const fi = new FakeInput();
    const rli = new readline.Interface({
      input: fi,
      output: fi,
      terminal: true,
      completer: common.mustCallAtLeast(completer),
    });
    const last = '\r\nFirst group\r\n\r\n' +
    `${char}${'a'.repeat(10)}${' '.repeat(2 + width * 10)}` +
      `${char}${'b'.repeat(10)}` +
      (lineBreak ? '\r\n' : ' '.repeat(2 + width * 10)) +
      `${char.repeat(11)}\r\n` +
    `\r\n\u001b[1G\u001b[0J> ${char}\u001b[${4 + width}G`;
    const expectations = [char, '', last];
    rli.on('line', common.mustNotCall());
    for (const character of `${char}\t\t`) {
      fi.emit('data', character);
      assert.strictEqual(output, expectations.shift());
      output = '';
    }
    rli.close();
  });
});
{
  let output = '';
  class FakeInput extends EventEmitter {
    columns = 80
    write = common.mustCall((data) => {
      output += data;
    }, 1)
    resume() {}
    pause() {}
    end() {}
  }
  const fi = new FakeInput();
  const rli = new readline.Interface({
    input: fi,
    output: fi,
    terminal: true,
    completer:
        common.mustCallAtLeast((_, cb) => cb(new Error('message'))),
  });
  rli.on('line', common.mustNotCall());
  fi.emit('data', '\t');
  queueMicrotask(() => {
    output = '';
  });
  rli.close();
}
{
  let output = '';
  class FakeInput extends EventEmitter {
    columns = 80
    write = common.mustCall((data) => {
      output += data;
    }, 9)
    resume() {}
    pause() {}
    end() {}
  }
  const fi = new FakeInput();
  const rli = new readline.Interface({
    input: fi,
    output: fi,
    terminal: true,
    completer: common.mustCall((input, cb) => {
      cb(null, [[input[0].toUpperCase() + input.slice(1)], input]);
    }),
  });
  rli.on('line', common.mustNotCall());
  fi.emit('data', 'input');
  queueMicrotask(() => {
    fi.emit('data', '\t');
    queueMicrotask(() => {
      output = '';
      rli.close();
    });
  });
}