'use strict';
const assert = require('assert');
const mod = require('module');
let partA, partB;
const partC = '';
if (common.isWindows) {
  partA = 'C:\\Users\\Rocko Artischocko\\AppData\\Roaming\\npm';
  partB = 'C:\\Program Files (x86)\\nodejs\\';
  process.env.NODE_PATH = `${partA};${partB};${partC}`;
} else {
  process.env.NODE_PATH = `${partA}:${partB}:${partC}`;
}
mod._initPaths();
assert.ok(mod.globalPaths.includes(partA));
assert.ok(mod.globalPaths.includes(partB));
assert.ok(!mod.globalPaths.includes(partC));
assert.ok(Array.isArray(mod.globalPaths));
