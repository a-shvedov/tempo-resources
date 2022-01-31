'use strict';
if (!process.features.inspector) return;
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
tmpdir.refresh();
const intervals = 40;
{
  const output = spawnSync(process.execPath, [
    '-r',
    fixtures.path('v8-coverage', 'take-coverage'),
    fixtures.path('v8-coverage', 'interval'),
  ], {
    env: {
      ...process.env,
      NODE_V8_COVERAGE: tmpdir.path,
      NODE_DEBUG_NATIVE: 'INSPECTOR_PROFILER',
      TEST_INTERVALS: intervals
    },
  });
  console.log(output.stderr.toString());
  assert.strictEqual(output.status, 0);
  const coverageFiles = fs.readdirSync(tmpdir.path);
  let coverages = [];
  for (const coverageFile of coverageFiles) {
    const coverage = require(path.join(tmpdir.path, coverageFile));
    for (const result of coverage.result) {
        coverages.push({
          file: coverageFile,
          func: result.functions.find((f) => f.functionName === 'interval'),
          timestamp: coverage.timestamp
        });
      }
    }
  }
  coverages = coverages.sort((a, b) => { return a.timestamp - b.timestamp; });
  console.log('Coverages:', coverages);
  assert.strictEqual(coverages.length, 3);
  let blockHitsTotal = 0;
  for (let i = 0; i < coverages.length; ++i) {
    const { ranges } = coverages[i].func;
    console.log('coverage', i, ranges);
    if (i !== coverages.length - 1) {
      assert.strictEqual(ranges.length, 2);
      const blockHits = ranges[0].count;
      assert.notStrictEqual(blockHits, 0);
      blockHitsTotal += blockHits;
      const elseBranchHits = ranges[1].count;
      assert.strictEqual(elseBranchHits, 0);
    } else {
      assert.strictEqual(ranges.length, 3);
      const blockHits = ranges[0].count;
      assert.notStrictEqual(blockHits, 0);
      blockHitsTotal += blockHits;
      const elseBranchHits = ranges[2].count;
      assert.strictEqual(elseBranchHits, 1);
      const ifBranchHits = ranges[1].count;
      assert.strictEqual(ifBranchHits, blockHits - elseBranchHits);
    }
  }
  assert.strictEqual(blockHitsTotal, intervals);
}