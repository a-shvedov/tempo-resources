'use strict';
if (common.isWindows) {
  common.skip('vcbuild.bat doesn\'t build the n-api benchmarks yet');
}
if (!common.isMainThread) {
  common.skip('addons are not supported in workers');
}
if (process.features.debug) {
  common.skip('benchmark does not work with debug build yet');
}
runBenchmark('napi', { NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
