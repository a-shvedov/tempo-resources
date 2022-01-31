'use strict';
if (process.config.variables.node_without_node_options)
  common.skip('missing NODE_OPTIONS support');
const assert = require('assert');
const exec = require('child_process').execFile;
const { Worker } = require('worker_threads');
tmpdir.refresh();
expectNoWorker(` -r ${printA} `, 'A\nB\n');
expectNoWorker(`-r ${printA}`, 'A\nB\n');
expectNoWorker(`-r ${JSON.stringify(printA)}`, 'A\nB\n');
expectNoWorker(`-r ${JSON.stringify(printSpaceA)}`, 'A\nB\n');
expectNoWorker(`-r ${printA} -r ${printA}`, 'A\nB\n');
expectNoWorker(`   -r ${printA}    -r ${printA}`, 'A\nB\n');
expectNoWorker(`   --require ${printA}    --require ${printA}`, 'A\nB\n');
expect('--no-deprecation', 'B\n');
expect('--no-warnings', 'B\n');
expect('--no_warnings', 'B\n');
expect('--trace-warnings', 'B\n');
expect('--redirect-warnings=_', 'B\n');
expect('--trace-deprecation', 'B\n');
expect('--trace-sync-io', 'B\n');
expectNoWorker('--trace-events-enabled', 'B\n');
expect('--track-heap-objects', 'B\n');
expect('--throw-deprecation',
       'new Buffer(42)',
       true);
expectNoWorker('--zero-fill-buffers', 'B\n');
expectNoWorker('--v8-pool-size=10', 'B\n');
expectNoWorker('--trace-event-categories node', 'B\n');
expectNoWorker(
  '--trace-event-file-pattern {pid}-${rotation}.trace_events',
  'B\n'
);
expectNoWorker('--trace-event-file-pattern {pid}-${rotation}.trace_events ' +
       '--trace-event-categories node.async_hooks', 'B\n');
expect('--unhandled-rejections=none', 'B\n');
if (common.isLinux) {
  expect('--perf-basic-prof', 'B\n');
  expect('--perf-basic-prof-only-functions', 'B\n');
  if (['arm', 'x64'].includes(process.arch)) {
    expect('--perf-prof', 'B\n');
    expect('--perf-prof-unwinding-info', 'B\n');
  }
}
if (common.hasCrypto) {
  expectNoWorker('--use-openssl-ca', 'B\n');
  expectNoWorker('--use-bundled-ca', 'B\n');
  if (!common.hasOpenSSL3)
    expectNoWorker('--openssl-config=_ossl_cfg', 'B\n');
}
expect('--abort_on-uncaught_exception', 'B\n');
expect('--disallow-code-generation-from-strings', 'B\n');
expect('--huge-max-old-generation-size', 'B\n');
expect('--jitless', 'B\n');
expect('--max-old-space-size=0', 'B\n');
expect('--stack-trace-limit=100',
       '(function f() { f(); })();',
       true);
if (!['arm', 'arm64'].includes(process.arch))
  expect('--interpreted-frames-native-stack', 'B\n');
expectNoWorker('--input-type=module',
               'B\n', 'console.log(await "B")');
function expectNoWorker(opt, want, command, wantsError) {
  expect(opt, want, command, wantsError, false);
}
function expect(
  opt, want, command = 'console.log("B")', wantsError = false, testWorker = true
) {
  const argv = ['-e', command];
  const opts = {
    cwd: tmpdir.path,
    env: Object.assign({}, process.env, { NODE_OPTIONS: opt }),
    maxBuffer: 1e6,
  };
  if (typeof want === 'string')
    want = new RegExp(want);
  const test = (type) => common.mustCall((err, stdout) => {
    const o = JSON.stringify(opt);
    if (wantsError) {
      assert.ok(err, `${type}: expected error for ${o}`);
      stdout = err.stack;
    } else {
      assert.ifError(err, `${type}: failed for ${o}`);
    }
    if (want.test(stdout)) return;
    assert.fail(
      `${type}: for ${o}, failed to find ${want} in: <\n${stdout}\n>`
    );
  });
  exec(process.execPath, argv, opts, test('child process'));
  if (testWorker)
    workerTest(opts, command, wantsError, test('worker'));
}
async function collectStream(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}
function workerTest(opts, command, wantsError, test) {
  let workerError = null;
  const worker = new Worker(command, {
    ...opts,
    execArgv: [],
    eval: true,
    stdout: true,
    stderr: true
  });
  worker.on('error', (err) => {
    workerError = err;
  });
  worker.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, wantsError ? 1 : 0);
    collectStream(worker.stdout).then((stdout) => {
      test(workerError, stdout);
    });
  }));
}