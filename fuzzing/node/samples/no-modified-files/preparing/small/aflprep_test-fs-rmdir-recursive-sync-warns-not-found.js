'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
{
  common.expectWarning(
    'DeprecationWarning',
    'In future versions of Node.js, fs.rmdir(path, { recursive: true }) ' +
      'will be removed. Use fs.rm(path, { recursive: true }) instead',
    'DEP0147'
  );
  assert.throws(
    () => fs.rmdirSync(path.join(tmpdir.path, 'noexist.txt'),
                       { recursive: true }),
    { code: 'ENOENT' }
  );
}