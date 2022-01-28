const assert = require('assert');
const net = require('net');
const fs = require('fs');
process.stdout.write('hello world\r\n');
const stdin = process.openStdin();
stdin.on('data', function(data) {
  process.stdout.write(data.toString());
});
stdin.on('end', function() {
  var fd = fs.openSync(process.argv[1], 'r');
  assert(fd > 2);
  fs.closeSync(fd);
});
